import threading
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from app.models import Issue, IssueCreate, IssueUpdate, IssueStatus, IssuePriority


class IssueStore:
    """Thread-safe in-memory storage for issues. Designed to be easily replaceable with database later."""
    
    def __init__(self):
        self._issues: Dict[int, Issue] = {}
        self._next_id = 1
        self._lock = threading.Lock()
        
        # Add some sample data
        self._initialize_sample_data()
    
    def _initialize_sample_data(self):
        """Initialize with some sample issues for demo purposes"""
        sample_issues = [
            IssueCreate(
                title="Login page not responsive on mobile",
                description="The login form doesn't fit properly on mobile screens",
                status=IssueStatus.OPEN,
                priority=IssuePriority.HIGH,
                assignee="john.doe"
            ),
            IssueCreate(
                title="Add dark mode support",
                description="Users have requested dark mode for better user experience",
                status=IssueStatus.IN_PROGRESS,
                priority=IssuePriority.MEDIUM,
                assignee="jane.smith"
            ),
            IssueCreate(
                title="API rate limiting",
                description="Implement rate limiting to prevent abuse",
                status=IssueStatus.CLOSED,
                priority=IssuePriority.CRITICAL,
                assignee="mike.wilson"
            ),
            IssueCreate(
                title="Update documentation",
                description="User guide needs to be updated with new features",
                status=IssueStatus.OPEN,
                priority=IssuePriority.LOW,
                assignee="sarah.johnson"
            ),
        ]
        
        for issue_data in sample_issues:
            self.create_issue(issue_data)
    
    def create_issue(self, issue_data: IssueCreate) -> Issue:
        """Create a new issue and return it"""
        with self._lock:
            now = datetime.utcnow()
            issue = Issue(
                id=self._next_id,
                created_at=now,
                updated_at=now,
                **issue_data.model_dump()
            )
            self._issues[self._next_id] = issue
            self._next_id += 1
            return issue
    
    def get_issue(self, issue_id: int) -> Optional[Issue]:
        """Get a single issue by ID"""
        with self._lock:
            return self._issues.get(issue_id)
    
    def update_issue(self, issue_id: int, update_data: IssueUpdate) -> Optional[Issue]:
        """Update an existing issue"""
        with self._lock:
            if issue_id not in self._issues:
                return None
            
            issue = self._issues[issue_id]
            update_dict = update_data.model_dump(exclude_unset=True)
            
            if update_dict:
                # Update fields
                for field, value in update_dict.items():
                    setattr(issue, field, value)
                
                # Update timestamp
                issue.updated_at = datetime.utcnow()
            
            return issue
    
    def get_issues(
        self, 
        page: int = 1, 
        page_size: int = 10,
        title_search: Optional[str] = None,
        status: Optional[IssueStatus] = None,
        priority: Optional[IssuePriority] = None,
        assignee: Optional[str] = None,
        sort_by: str = "updated_at",
        sort_desc: bool = True
    ) -> Tuple[List[Issue], int]:
        """
        Get filtered and paginated issues
        Returns: (issues_list, total_count)
        """
        with self._lock:
            # Get all issues
            issues = list(self._issues.values())
            
            # Apply filters
            if title_search:
                issues = [issue for issue in issues if title_search.lower() in issue.title.lower()]
            
            if status:
                issues = [issue for issue in issues if issue.status == status]
            
            if priority:
                issues = [issue for issue in issues if issue.priority == priority]
            
            if assignee:
                issues = [issue for issue in issues if issue.assignee and assignee.lower() in issue.assignee.lower()]
            
            total_count = len(issues)
            
            # Apply sorting
            reverse_sort = sort_desc
            if sort_by == "id":
                issues.sort(key=lambda x: x.id, reverse=reverse_sort)
            elif sort_by == "title":
                issues.sort(key=lambda x: x.title.lower(), reverse=reverse_sort)
            elif sort_by == "status":
                issues.sort(key=lambda x: x.status.value, reverse=reverse_sort)
            elif sort_by == "priority":
                # Custom priority sorting: critical > high > medium > low
                priority_order = {
                    IssuePriority.CRITICAL: 4,
                    IssuePriority.HIGH: 3,
                    IssuePriority.MEDIUM: 2,
                    IssuePriority.LOW: 1
                }
                issues.sort(key=lambda x: priority_order.get(x.priority, 0), reverse=reverse_sort)
            elif sort_by == "assignee":
                issues.sort(key=lambda x: x.assignee or "", reverse=reverse_sort)
            elif sort_by == "created_at":
                issues.sort(key=lambda x: x.created_at, reverse=reverse_sort)
            else:  # default to updated_at
                issues.sort(key=lambda x: x.updated_at, reverse=reverse_sort)
            
            # Apply pagination
            start_idx = (page - 1) * page_size
            end_idx = start_idx + page_size
            paginated_issues = issues[start_idx:end_idx]
            
            return paginated_issues, total_count
    
    def delete_issue(self, issue_id: int) -> bool:
        """Delete an issue (for future use)"""
        with self._lock:
            if issue_id in self._issues:
                del self._issues[issue_id]
                return True
            return False
    
    def get_all_assignees(self) -> List[str]:
        """Get list of all unique assignees"""
        with self._lock:
            assignees = {issue.assignee for issue in self._issues.values() if issue.assignee}
            return sorted(list(assignees))


# Global instance
issue_store = IssueStore()