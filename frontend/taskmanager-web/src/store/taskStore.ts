import { create } from 'zustand';
import type { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../types';
import { tasksApi } from '../api/tasks';

interface TaskState {
  tasks: Task[];
  statuses: TaskStatus[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchStatuses: () => Promise<void>;
  createTask: (data: CreateTaskDto) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Promise<Task | null>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  statuses: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await tasksApi.getAll();
      if (response.data.success && response.data.data) {
        set({ tasks: response.data.data, loading: false });
      } else {
        set({ error: response.data.errors?.[0] || 'Failed to fetch tasks', loading: false });
      }
    } catch {
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },

  fetchStatuses: async () => {
    try {
      const response = await tasksApi.getStatuses();
      if (response.data.success && response.data.data) {
        set({ statuses: response.data.data });
      }
    } catch {
      // silent fail for statuses
    }
  },

  createTask: async (data: CreateTaskDto) => {
    const response = await tasksApi.create(data);
    if (response.data.success && response.data.data) {
      set((state) => ({ tasks: [...state.tasks, response.data.data!] }));
      return response.data.data;
    }
    throw new Error(response.data.errors?.[0] || 'Failed to create task');
  },

  updateTask: async (id: string, data: UpdateTaskDto) => {
    const response = await tasksApi.update(id, data);
    if (response.data.success && response.data.data) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data.data! : t)),
      }));
      return response.data.data;
    }
    throw new Error(response.data.errors?.[0] || 'Failed to update task');
  },

  deleteTask: async (id: string) => {
    const response = await tasksApi.delete(id);
    if (response.data.success) {
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    } else {
      throw new Error(response.data.errors?.[0] || 'Failed to delete task');
    }
  },

  getTaskById: async (id: string) => {
    const response = await tasksApi.getById(id);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return null;
  },


}));
