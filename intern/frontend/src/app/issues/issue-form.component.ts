import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Issue } from './issue.model';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card" style="margin-top:12px;">
      <h3>{{ issue ? 'Edit Issue' : 'Create Issue' }}</h3>

      <div class="form-grid">
        <label>Title
          <input class="input" [(ngModel)]="title" />
        </label>

        <label>Status
          <select class="input" [(ngModel)]="status">
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </label>

        <label>Priority
          <select class="input" [(ngModel)]="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </label>

        <label>Assignee
          <input class="input" [(ngModel)]="assignee" />
        </label>
      </div>

      <div style="margin-top:12px;">
        <label>Description</label>
        <textarea rows="4" [(ngModel)]="description"></textarea>
      </div>

      <div class="form-actions">
        <button class="btn btn--primary" (click)="emitSave()" [disabled]="!title?.trim()">Save</button>
        <button class="btn" (click)="cancel.emit()">Cancel</button>
      </div>
    </div>
  `
})
export class IssueFormComponent {
  @Input() issue: Issue | null = null;
  @Output() save = new EventEmitter<Partial<Issue>>();
  @Output() cancel = new EventEmitter<void>();

  title = '';
  description = '';
  status: Issue['status'] = 'open';
  priority: Issue['priority'] = 'medium';
  assignee = '';

  ngOnChanges(): void {
    if (this.issue) {
      this.title = this.issue.title;
      this.description = this.issue.description || '';
      this.status = this.issue.status;
      this.priority = this.issue.priority;
      this.assignee = this.issue.assignee || '';
    } else {
      this.title = '';
      this.description = '';
      this.status = 'open';
      this.priority = 'medium';
      this.assignee = '';
    }
  }

  emitSave(): void {
    this.save.emit({
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assignee: this.assignee || null
    });
  }
}