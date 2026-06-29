import apiClient from './client';
import type { ApiResponse, Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types';

export const tasksApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Task[]>>('/api/tasks'),
  
  getById: (id: string) =>
    apiClient.get<ApiResponse<Task>>(`/api/tasks/${id}`),
  
  create: (data: CreateTaskDto) =>
    apiClient.post<ApiResponse<Task>>('/api/tasks', data),
  
  update: (id: string, data: UpdateTaskDto) =>
    apiClient.put<ApiResponse<Task>>(`/api/tasks/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/tasks/${id}`),
  
  complete: (id: string) =>
    apiClient.patch<ApiResponse<null>>(`/api/tasks/${id}/complete`),
  
  getStatuses: () =>
    apiClient.get<ApiResponse<TaskStatus[]>>('/api/tasks/statuses'),
};
