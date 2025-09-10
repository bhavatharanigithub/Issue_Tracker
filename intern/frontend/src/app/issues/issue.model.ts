export type IssueStatus = 'open' | 'in_progress' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Issue {
  id: number;
  title: string;
  description?: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueListResponse {
  items: Issue[];
  total: number;
  page: number;
  pageSize: number;
}

