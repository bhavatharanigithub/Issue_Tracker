from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from .schemas import Issue, IssueCreate, IssueUpdate, IssueStatus, IssuePriority
from .storage import store

app = FastAPI(title="Issue Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/issues")
async def list_issues(
    q: Optional[str] = None,
    status: Optional[IssueStatus] = Query(default=None),
    priority: Optional[IssuePriority] = Query(default=None),
    assignee: Optional[str] = None,
    sortBy: str = "updatedAt",
    sortDir: str = "desc",
    page: int = 1,
    pageSize: int = 10,
):
    return store.list_issues(q, status, priority, assignee, sortBy, sortDir, page, pageSize)


@app.get("/issues/{issue_id}", response_model=Issue)
async def get_issue(issue_id: int):
    issue = store.get_issue(issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@app.post("/issues", response_model=Issue)
async def create_issue(payload: IssueCreate):
    return store.create_issue(payload)


@app.put("/issues/{issue_id}", response_model=Issue)
async def update_issue(issue_id: int, payload: IssueUpdate):
    updated = store.update_issue(issue_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Issue not found")
    return updated

