from __future__ import annotations
from datetime import datetime
from typing import List, Optional, Dict, Any
from .schemas import Issue, IssueCreate, IssueUpdate, IssueStatus, IssuePriority


class IssueStore:
    def __init__(self) -> None:
        self._issues: List[Issue] = []
        self._next_id: int = 1
        self._seed()

    def _seed(self) -> None:
        now = datetime.utcnow()
        samples = [
            Issue(id=self._next_id, title="Login page bug", description="Error on submit", status=IssueStatus.open, priority=IssuePriority.high, assignee="Alice", createdAt=now, updatedAt=now),
            Issue(id=self._next_id + 1, title="Improve docs", description="Add API examples", status=IssueStatus.in_progress, priority=IssuePriority.medium, assignee="Bob", createdAt=now, updatedAt=now),
            Issue(id=self._next_id + 2, title="Crash on mobile", description="Null ref in view", status=IssueStatus.closed, priority=IssuePriority.critical, assignee="Carol", createdAt=now, updatedAt=now),
        ]
        self._issues.extend(samples)
        self._next_id += len(samples)

    def create_issue(self, payload: IssueCreate) -> Issue:
        now = datetime.utcnow()
        issue = Issue(
            id=self._next_id,
            title=payload.title,
            description=payload.description,
            status=payload.status,
            priority=payload.priority,
            assignee=payload.assignee,
            createdAt=now,
            updatedAt=now,
        )
        self._issues.append(issue)
        self._next_id += 1
        return issue

    def update_issue(self, issue_id: int, payload: IssueUpdate) -> Optional[Issue]:
        issue = self.get_issue(issue_id)
        if not issue:
            return None
        data = payload.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(issue, key, value)
        issue.updatedAt = datetime.utcnow()
        return issue

    def get_issue(self, issue_id: int) -> Optional[Issue]:
        return next((i for i in self._issues if i.id == issue_id), None)

    def list_issues(
        self,
        q: Optional[str] = None,
        status: Optional[IssueStatus] = None,
        priority: Optional[IssuePriority] = None,
        assignee: Optional[str] = None,
        sortBy: str = "updatedAt",
        sortDir: str = "desc",
        page: int = 1,
        pageSize: int = 10,
    ) -> Dict[str, Any]:
        items = self._issues

        # Search
        if q:
            q_lower = q.lower()
            items = [i for i in items if q_lower in i.title.lower()]

        # Filters
        if status:
            items = [i for i in items if i.status == status]
        if priority:
            items = [i for i in items if i.priority == priority]
        if assignee:
            items = [i for i in items if (i.assignee or "").lower() == assignee.lower()]

        # Sorting
        def sort_key(issue: Issue):
            return getattr(issue, sortBy, None)

        reverse = sortDir.lower() == "desc"
        try:
            items = sorted(items, key=sort_key, reverse=reverse)
        except Exception:
            # Fallback to id
            items = sorted(items, key=lambda i: i.id, reverse=reverse)

        # Pagination
        total = len(items)
        page = max(1, page)
        pageSize = max(1, min(pageSize, 100))
        start = (page - 1) * pageSize
        end = start + pageSize
        paged = items[start:end]

        return {
            "items": [i.model_dump() for i in paged],
            "total": total,
            "page": page,
            "pageSize": pageSize,
        }


store = IssueStore()

