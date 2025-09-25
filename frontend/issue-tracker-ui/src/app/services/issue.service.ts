import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  Issue, 
  IssueCreate, 
  IssueUpdate, 
  PaginatedIssuesResponse, 
  IssueFilters 
} from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  /**
   * Health check endpoint
   */
  healthCheck(): Observable<{status: string}> {
    return this.http.get<{status: string}>(`${this.baseUrl}/health`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get paginated and filtered issues
   */
  getIssues(filters?: IssueFilters): Observable<PaginatedIssuesResponse> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.page_size) params = params.set('page_size', filters.page_size.toString());
      if (filters.title) params = params.set('title', filters.title);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.assignee) params = params.set('assignee', filters.assignee);
      if (filters.sort_by) params = params.set('sort_by', filters.sort_by);
      if (filters.sort_desc !== undefined) params = params.set('sort_desc', filters.sort_desc.toString());
    }

    return this.http.get<PaginatedIssuesResponse>(`${this.baseUrl}/issues`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get a single issue by ID
   */
  getIssue(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.baseUrl}/issues/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Create a new issue
   */
  createIssue(issue: IssueCreate): Observable<Issue> {
    return this.http.post<Issue>(`${this.baseUrl}/issues`, issue)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing issue
   */
  updateIssue(id: number, update: IssueUpdate): Observable<Issue> {
    return this.http.put<Issue>(`${this.baseUrl}/issues/${id}`, update)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all unique assignees
   */
  getAssignees(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/assignees`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    
    let errorMessage = 'An error occurred';
    if (error.error?.detail) {
      errorMessage = error.error.detail;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}