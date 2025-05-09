export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: number;
} 