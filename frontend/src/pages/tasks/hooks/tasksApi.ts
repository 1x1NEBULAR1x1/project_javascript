import { axiosInstance } from '../../../axiosConfig';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axiosInstance.get<{ data: { tasks: Task[] } }>('/tasks');
    return response.data.data.tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const fetchTaskById = async (id: number): Promise<Task> => {
  try {
    const response = await axiosInstance.get<Task>(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
};

export const fetchTasksByStatus = async (status: string): Promise<Task[]> => {
  try {
    const response = await axiosInstance.get<Task[]>(`/tasks/status/${status}`);
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

    const response = await axiosInstance.post<Task>('/tasks', taskData);
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

    const response = await axiosInstance.put<Task>(`/tasks/${id}`, taskData);
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

    await axiosInstance.delete(`/tasks/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
}; 