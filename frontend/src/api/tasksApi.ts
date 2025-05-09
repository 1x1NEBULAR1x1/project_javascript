import axios from 'axios';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/Task';

// Создаем экземпляр axios с базовым URL и заголовками
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

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
    // Убедимся, что обязательные поля присутствуют
    if (!taskData.title) {
      throw new Error('Название задачи обязательно');
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
    // Проверим что id существует и данные не пусты
    if (!id) {
      throw new Error('ID задачи обязателен');
    }

    if (Object.keys(taskData).length === 0) {
      throw new Error('Нет данных для обновления');
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
      throw new Error('ID задачи обязателен');
    }

    await api.delete(`/tasks/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
}; 