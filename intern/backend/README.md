# Issue Tracker Backend (FastAPI)

## Run (development)

```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: . .venv/Scripts/Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Endpoints
- GET `/health`
- GET `/issues`
  - Query: `q`, `status`, `priority`, `assignee`, `sortBy`, `sortDir` (asc|desc), `page` (1-based), `pageSize`
- GET `/issues/{id}`
- POST `/issues`
- PUT `/issues/{id}`

Notes:
- In-memory storage for simplicity. Data resets on server restart.
- `id` auto-incremented, `createdAt` and `updatedAt` managed by server.
- CORS enabled for Angular dev server at `http://localhost:4200`.

