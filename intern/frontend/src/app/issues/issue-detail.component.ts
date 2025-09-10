import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IssuesService } from './issues.service';
import { Issue } from './issue.model';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="issue" class="card">
      <h3>Issue #{{issue.id}} — {{issue.title}}</h3>
      <pre>{{ issue | json }}</pre>
    </div>
  `
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  constructor(private route: ActivatedRoute, private api: IssuesService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.api.get(id).subscribe(v => this.issue = v);
    }
  }
}

@Component({
  selector: 'app-issue-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="drawer-backdrop" *ngIf="issue" (click)="close.emit()"></div>
    <div class="drawer" *ngIf="issue">
      <div class="drawer-header">
        <strong>Issue #{{issue?.id}} — {{issue?.title}}</strong>
        <button class="btn btn--ghost" (click)="close.emit()">Close</button>
      </div>
      <div class="toolbar" style="margin-bottom:8px;">
        <span class="badge" [ngClass]="'badge--status-' + issue?.status">{{issue?.status | titlecase}}</span>
        <span class="badge" [ngClass]="'badge--priority-' + issue?.priority">{{issue?.priority | titlecase}}</span>
        <span class="muted">Assignee: {{issue?.assignee || '-'}}</span>
      </div>
      <pre>{{ issue | json }}</pre>
    </div>
  `
})
export class IssueDrawerComponent {
  @Input() issue: Issue | null = null;
  @Output() close = new EventEmitter<void>();
}

