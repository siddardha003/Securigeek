import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { IssueService } from '../../services/issue.service';
import { Issue, IssueStatus, IssuePriority } from '../../models/issue.model';

@Component({
  selector: 'app-issue-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './issue-detail.html',
  styleUrl: './issue-detail.scss'
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  loading = true;
  issueId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.issueId = parseInt(params['id']);
      if (this.issueId) {
        this.loadIssue();
      } else {
        this.router.navigate(['/issues']);
      }
    });
  }

  loadIssue(): void {
    if (!this.issueId) return;
    
    this.loading = true;
    this.issueService.getIssue(this.issueId).subscribe({
      next: (issue) => {
        this.issue = issue;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading issue:', error);
        this.snackBar.open('Error loading issue details', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/issues']);
      }
    });
  }

  onEdit(): void {
    if (this.issue) {
      this.router.navigate(['/issues', this.issue.id, 'edit']);
    }
  }

  onBackToList(): void {
    this.router.navigate(['/issues']);
  }

  getStatusColor(status: IssueStatus): string {
    switch (status) {
      case IssueStatus.OPEN:
        return 'primary';
      case IssueStatus.IN_PROGRESS:
        return 'accent';
      case IssueStatus.CLOSED:
        return 'warn';
      default:
        return '';
    }
  }

  getPriorityColor(priority: IssuePriority): string {
    switch (priority) {
      case IssuePriority.CRITICAL:
        return 'warn';
      case IssuePriority.HIGH:
        return 'accent';
      case IssuePriority.MEDIUM:
        return 'primary';
      case IssuePriority.LOW:
        return '';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
