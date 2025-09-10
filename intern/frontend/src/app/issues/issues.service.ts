import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue, IssueListResponse } from './issue.model';

const API_BASE = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class IssuesService {
  constructor(private http: HttpClient) {}

  list(params: {
    q?: string;
    status?: string;
    priority?: string;
    assignee?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Observable<IssueListResponse> {
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        hp = hp.set(k, String(v));
      }
    });
    return this.http.get<IssueListResponse>(`${API_BASE}/issues`, { params: hp });
  }

  get(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${API_BASE}/issues/${id}`);
  }

  create(payload: Partial<Issue>): Observable<Issue> {
    return this.http.post<Issue>(`${API_BASE}/issues`, payload);
  }

  update(id: number, payload: Partial<Issue>): Observable<Issue> {
    return this.http.put<Issue>(`${API_BASE}/issues/${id}`, payload);
  }
}

