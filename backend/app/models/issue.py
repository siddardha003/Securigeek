from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class IssueStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"


class IssuePriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IssueBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Issue title")
    description: Optional[str] = Field(None, max_length=2000, description="Issue description")
    status: IssueStatus = Field(default=IssueStatus.OPEN, description="Issue status")
    priority: IssuePriority = Field(default=IssuePriority.MEDIUM, description="Issue priority")
    assignee: Optional[str] = Field(None, max_length=100, description="Assigned person")


class IssueCreate(IssueBase):
    """Model for creating a new issue"""
    pass


class IssueUpdate(BaseModel):
    """Model for updating an existing issue"""
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Issue title")
    description: Optional[str] = Field(None, max_length=2000, description="Issue description")
    status: Optional[IssueStatus] = Field(None, description="Issue status")
    priority: Optional[IssuePriority] = Field(None, description="Issue priority")
    assignee: Optional[str] = Field(None, max_length=100, description="Assigned person")


class Issue(IssueBase):
    """Full issue model with all fields"""
    id: int = Field(..., description="Unique issue identifier")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class IssueResponse(Issue):
    """Response model for issue endpoints"""
    pass


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = Field(default="ok")


class PaginatedIssuesResponse(BaseModel):
    """Paginated response for issues list"""
    items: list[Issue]
    total: int
    page: int
    page_size: int
    total_pages: int