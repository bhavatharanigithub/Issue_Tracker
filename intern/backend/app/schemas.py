from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class IssueStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"


class IssuePriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class IssueBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    status: IssueStatus = IssueStatus.open
    priority: IssuePriority = IssuePriority.medium
    assignee: Optional[str] = None


class IssueCreate(IssueBase):
    pass


class IssueUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    status: Optional[IssueStatus] = None
    priority: Optional[IssuePriority] = None
    assignee: Optional[str] = None


class Issue(IssueBase):
    id: int
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

