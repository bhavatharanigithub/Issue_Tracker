import { Routes } from '@angular/router';
import { IssuesListComponent } from './issues/issues-list.component';
import { IssueDetailComponent } from './issues/issue-detail.component';

export const routes: Routes = [
  { path: '', component: IssuesListComponent },
  { path: 'issues/:id', component: IssueDetailComponent },
  { path: '**', redirectTo: '' }
];

