import { Routes } from '@angular/router';
import { IssueListComponent } from './components/issue-list/issue-list';
import { IssueDetailComponent } from './components/issue-detail/issue-detail';
import { IssueFormComponent } from './components/issue-form/issue-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/issues',
    pathMatch: 'full'
  },
  {
    path: 'issues',
    component: IssueListComponent,
    title: 'Issues - Issue Tracker'
  },
  {
    path: 'issues/new',
    component: IssueFormComponent,
    title: 'Create Issue - Issue Tracker'
  },
  {
    path: 'issues/:id',
    component: IssueDetailComponent,
    title: 'Issue Details - Issue Tracker'
  },
  {
    path: 'issues/:id/edit',
    component: IssueFormComponent,
    title: 'Edit Issue - Issue Tracker'
  },
  {
    path: '**',
    redirectTo: '/issues'
  }
];
