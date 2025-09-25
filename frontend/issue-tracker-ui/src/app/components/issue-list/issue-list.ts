import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IssueService } from '../../services/issue.service';
import { Issue, IssueStatus, IssuePriority, IssueFilters, PaginatedIssuesResponse } from '../../models/issue.model';

@Component({
  selector: 'app-issue-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './issue-list.html',
  styleUrl: './issue-list.scss'
})
export class IssueListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'status', 'priority', 'assignee', 'updated_at', 'actions'];
  issues: Issue[] = [];
  loading = false;
  
  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  
  // Filters
  filterForm: FormGroup;
  statuses = Object.values(IssueStatus);
  priorities = Object.values(IssuePriority);
  assignees: string[] = [];
  
  // Sorting
  currentSort: Sort = { active: 'updated_at', direction: 'desc' };

  constructor(
    private issueService: IssueService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      title: [''],
      status: [''],
      priority: [''],
      assignee: ['']
    });
  }

  ngOnInit(): void {
    this.loadAssignees();
    this.loadIssues();
    
    // Watch for filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadIssues();
    });
  }

  loadIssues(): void {
    this.loading = true;
    
    const filters: IssueFilters = {
      page: this.currentPage + 1,
      page_size: this.pageSize,
      sort_by: this.currentSort.active,
      sort_desc: this.currentSort.direction === 'desc',
      ...this.filterForm.value
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof IssueFilters] === '') {
        delete filters[key as keyof IssueFilters];
      }
    });

    this.issueService.getIssues(filters).subscribe({
      next: (response: PaginatedIssuesResponse) => {
        this.issues = response.items;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading issues:', error);
        this.snackBar.open('Error loading issues', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadAssignees(): void {
    this.issueService.getAssignees().subscribe({
      next: (assignees) => {
        this.assignees = assignees;
      },
      error: (error) => {
        console.error('Error loading assignees:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadIssues();
  }

  onSortChange(sort: Sort): void {
    this.currentSort = sort;
    this.loadIssues();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 0;
  }

  onRowClick(issue: Issue): void {
    this.router.navigate(['/issues', issue.id]);
  }

  onCreateIssue(): void {
    this.router.navigate(['/issues', 'new']);
  }

  onEditIssue(event: Event, issue: Issue): void {
    event.stopPropagation();
    this.router.navigate(['/issues', issue.id, 'edit']);
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
