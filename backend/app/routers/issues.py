import math
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.models import (
    Issue, 
    IssueCreate, 
    IssueUpdate, 
    IssueResponse, 
    PaginatedIssuesResponse,
    IssueStatus,
    IssuePriority,
    HealthResponse
)
from app.services import issue_store

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="ok")


@router.get("/issues", response_model=PaginatedIssuesResponse)
async def get_issues(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    title: Optional[str] = Query(None, description="Search by title"),
    status: Optional[IssueStatus] = Query(None, description="Filter by status"),
    priority: Optional[IssuePriority] = Query(None, description="Filter by priority"), 
    assignee: Optional[str] = Query(None, description="Filter by assignee"),
    sort_by: str = Query("updated_at", description="Sort field (id, title, status, priority, assignee, created_at, updated_at)"),
    sort_desc: bool = Query(True, description="Sort descending")
):
    """
    Get paginated and filtered issues with sorting support
    """
    issues, total_count = issue_store.get_issues(
        page=page,
        page_size=page_size,
        title_search=title,
        status=status,
        priority=priority,
        assignee=assignee,
        sort_by=sort_by,
        sort_desc=sort_desc
    )
    
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1
    
    return PaginatedIssuesResponse(
        items=issues,
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/issues/{issue_id}", response_model=IssueResponse)
async def get_issue(issue_id: int):
    """Get a single issue by ID"""
    issue = issue_store.get_issue(issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@router.post("/issues", response_model=IssueResponse, status_code=201)
async def create_issue(issue_data: IssueCreate):
    """Create a new issue"""
    issue = issue_store.create_issue(issue_data)
    return issue


@router.put("/issues/{issue_id}", response_model=IssueResponse)
async def update_issue(issue_id: int, update_data: IssueUpdate):
    """Update an existing issue"""
    issue = issue_store.update_issue(issue_id, update_data)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@router.get("/assignees", response_model=list[str])
async def get_assignees():
    """Get list of all unique assignees (useful for frontend filters)"""
    return issue_store.get_all_assignees()