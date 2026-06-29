export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface TaskStatus {
  id: number;
  name: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: string;
  statusId: number;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  dueDate: string;
  statusId: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  expiresAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  errors: string[];
}

export interface User {
  email: string;
}
