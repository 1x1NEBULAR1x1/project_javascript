import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/task';
import { api } from './baseApi';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const fetchTaskById = async (id: number): Promise<Task> => {
  try {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
};

export const fetchTasksByStatus = async (status: string): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>(`/tasks?status=${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks with status ${status}:`, error);
    throw error;
  }
};

export const createTask = async (taskData: CreateTaskDto): Promise<Task> => {
  try {
    if (!taskData.title) {
      throw new Error('Task name is required');
    }

    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id: number, taskData: UpdateTaskDto): Promise<Task> => {
  try {
    if (!id) {
      throw new Error('Task Id id required');
    }

    if (Object.keys(taskData).length === 0) {
      throw new Error('Not data to update');
    }

    const response = await api.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<boolean> => {
  try {
    if (!id) {
      throw new Error('Task Id is required');
    }

    await api.delete(`/tasks/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
}; 