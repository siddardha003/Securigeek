import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { IssueService } from '../../services/issue.service';
import { Issue, IssueStatus, IssuePriority, IssueCreate, IssueUpdate } from '../../models/issue.model';

@Component({
  selector: 'app-issue-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './issue-form.html',
  styleUrl: './issue-form.scss'
})
export class IssueFormComponent implements OnInit {
  issueForm: FormGroup;
  isEditMode = false;
  issueId: number | null = null;
  loading = false;
  saving = false;
  
  statuses = Object.values(IssueStatus);
  priorities = Object.values(IssuePriority);
  assignees: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private snackBar: MatSnackBar
  ) {
    this.issueForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      status: [IssueStatus.OPEN, Validators.required],
      priority: [IssuePriority.MEDIUM, Validators.required],
      assignee: ['']
    });
  }

  ngOnInit(): void {
    this.loadAssignees();
    
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id !== 'new') {
        this.issueId = parseInt(id);
        this.isEditMode = true;
        this.loadIssue();
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

  loadIssue(): void {
    if (!this.issueId) return;
    
    this.loading = true;
    this.issueService.getIssue(this.issueId).subscribe({
      next: (issue) => {
        this.issueForm.patchValue({
          title: issue.title,
          description: issue.description || '',
          status: issue.status,
          priority: issue.priority,
          assignee: issue.assignee || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading issue:', error);
        this.snackBar.open('Error loading issue for editing', 'Close', { duration: 3000 });
        this.router.navigate(['/issues']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.issueForm.valid) {
      this.saving = true;
      const formValue = this.issueForm.value;
      
      // Clean up empty assignee
      if (!formValue.assignee) {
        formValue.assignee = null;
      }
      
      if (this.isEditMode && this.issueId) {
        this.updateIssue(formValue);
      } else {
        this.createIssue(formValue);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createIssue(formValue: any): void {
    const issueData: IssueCreate = {
      title: formValue.title,
      description: formValue.description || undefined,
      status: formValue.status,
      priority: formValue.priority,
      assignee: formValue.assignee || undefined
    };

    this.issueService.createIssue(issueData).subscribe({
      next: (issue) => {
        this.snackBar.open('Issue created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/issues', issue.id]);
        this.saving = false;
      },
      error: (error) => {
        console.error('Error creating issue:', error);
        this.snackBar.open('Error creating issue', 'Close', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  updateIssue(formValue: any): void {
    if (!this.issueId) return;
    
    const updateData: IssueUpdate = {
      title: formValue.title,
      description: formValue.description || undefined,
      status: formValue.status,
      priority: formValue.priority,
      assignee: formValue.assignee || undefined
    };

    this.issueService.updateIssue(this.issueId, updateData).subscribe({
      next: (issue) => {
        this.snackBar.open('Issue updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/issues', issue.id]);
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating issue:', error);
        this.snackBar.open('Error updating issue', 'Close', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.issueId) {
      this.router.navigate(['/issues', this.issueId]);
    } else {
      this.router.navigate(['/issues']);
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.issueForm.controls).forEach(key => {
      this.issueForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.issueForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${maxLength} characters`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.issueForm.get(fieldName);
    return !!(field?.errors && field?.touched);
  }
}
