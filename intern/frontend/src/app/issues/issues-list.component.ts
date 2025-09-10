import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IssuesService } from './issues.service';
import { Issue } from './issue.model';
import { IssueFormComponent } from './issue-form.component';
import { IssueDrawerComponent } from './issue-detail.component';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IssueFormComponent, IssueDrawerComponent],
  template: `
  <div class="toolbar toolbar--filters">
    <input class="input" placeholder="Search title..." [(ngModel)]="q" (ngModelChange)="reload()" />
    <select class="input" [(ngModel)]="status" (change)="reload()">
      <option value="">Status</option>
      <option value="open">Open</option>
      <option value="in_progress">In Progress</option>
      <option value="closed">Closed</option>
    </select>
    <select class="input" [(ngModel)]="priority" (change)="reload()">
      <option value="">Priority</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="critical">Critical</option>
    </select>
    <input class="input" placeholder="Assignee" [(ngModel)]="assignee" (ngModelChange)="reload()" />
    <span class="spacer"></span>
    <button class="btn btn--primary" (click)="openCreate()">Create Issue</button>
  </div>

  <table class="table" role="grid">
    <thead>
      <tr>
        <th (click)="setSort('id')">ID</th>
        <th (click)="setSort('title')">Title</th>
        <th (click)="setSort('status')">Status</th>
        <th (click)="setSort('priority')">Priority</th>
        <th (click)="setSort('assignee')">Assignee</th>
        <th (click)="setSort('updatedAt')">Updated</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let issue of items" (click)="openDetail(issue)" style="cursor:pointer">
        <td>{{issue.id}}</td>
        <td>{{issue.title}}</td>
        <td>
          <span class="badge" [ngClass]="'badge--status-' + issue.status">
            {{issue.status | titlecase}}
          </span>
        </td>
        <td>
          <span class="badge" [ngClass]="'badge--priority-' + issue.priority">
            {{issue.priority | titlecase}}
          </span>
        </td>
        <td>{{issue.assignee || '-'}}</td>
        <td>{{issue.updatedAt | date:'short'}}</td>
        <td class="actions" (click)="$event.stopPropagation()">
          <button class="btn btn--sm" (click)="openEdit(issue)">Edit</button>
        </td>
      </tr>
      <tr *ngIf="items.length === 0">
        <td colspan="7">
          <div class="empty">
            <div>
              No issues found.
              <span class="muted">Try adjusting filters.</span>
            </div>
            <button class="btn btn--primary btn--sm" (click)="openCreate()">Create Issue</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="toolbar">
    <button class="btn btn--sm" [disabled]="page<=1" (click)="page=page-1; reload()">Prev</button>
    <span>Page {{page}} / {{totalPages || 1}}</span>
    <button class="btn btn--sm" [disabled]="page>=totalPages" (click)="page=page+1; reload()">Next</button>
    <select class="input" [(ngModel)]="pageSize" (change)="page=1; reload()">
      <option [ngValue]="5">5</option>
      <option [ngValue]="10">10</option>
      <option [ngValue]="20">20</option>
    </select>
  </div>

  <app-issue-form *ngIf="showForm" [issue]="editingIssue" (cancel)="closeForm()" (save)="saveIssue($event)"></app-issue-form>
  <app-issue-drawer *ngIf="showDrawer" [issue]="selectedIssue" (close)="showDrawer=false"></app-issue-drawer>
  `
})
export class IssuesListComponent implements OnInit {
  items: Issue[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  sortBy = 'updatedAt';
  sortDir: 'asc' | 'desc' = 'desc';

  q = '';
  status = '';
  priority = '';
  assignee = '';

  showForm = false;
  editingIssue: Issue | null = null;
  showDrawer = false;
  selectedIssue: Issue | null = null;

  constructor(private api: IssuesService, private router: Router) {}

  ngOnInit(): void {
    this.reload();
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  reload(): void {
    this.api.list({
      q: this.q || undefined,
      status: this.status || undefined,
      priority: this.priority || undefined,
      assignee: this.assignee || undefined,
      sortBy: this.sortBy,
      sortDir: this.sortDir,
      page: this.page,
      pageSize: this.pageSize
    }).subscribe(res => {
      this.items = res.items;
      this.total = res.total;
    });
  }

  setSort(field: string): void {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = 'asc';
    }
    this.reload();
  }

  openCreate(): void {
    this.editingIssue = null;
    this.showForm = true;
  }

  openEdit(issue: Issue): void {
    this.editingIssue = issue;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveIssue(payload: Partial<Issue>): void {
    if (this.editingIssue) {
      this.api.update(this.editingIssue.id, payload).subscribe(() => {
        this.showForm = false;
        this.reload();
      });
    } else {
      this.api.create(payload).subscribe(() => {
        this.showForm = false;
        this.page = 1;
        this.reload();
      });
    }
  }

  openDetail(issue: Issue): void {
    this.selectedIssue = issue;
    this.showDrawer = true;
  }
}
