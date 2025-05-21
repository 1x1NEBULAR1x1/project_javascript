import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTaskStore } from './taskStore';
import { useNotification } from '../../../notification/NotificationContext';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from './tasksApi';
import { fetchTasks, createTask, updateTask, deleteTask } from './tasksApi';

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  const {
    tasks,
    setTasks,
    addTask,
    updateTaskInStore,
    removeTask
  } = useTaskStore();

  const fetchTasksWrapper = async (): Promise<Task[]> => {
    try {
      const fetched_tasks = await fetchTasks();
      setTasks(fetched_tasks);
      showSuccess('Zadania zostały załadowane');
      return fetched_tasks;
    } catch (error: any) {
      showError(error.message || 'Błąd podczas ładowania zadań');
      throw error;
    }
  };

  const tasks_query = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasksWrapper,
    initialData: tasks,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  const create_task_mutation = useMutation({
    mutationFn: async (task_data: CreateTaskDto) => {
      try {
        const new_task = await createTask(task_data);
        addTask(new_task);
        showSuccess('Zadanie zostało utworzone');
        return new_task;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas tworzenia zadania');
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Zadanie zostało utworzone');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas tworzenia zadania');
    }
  });

  const update_task_mutation = useMutation({
    mutationFn: async ({ id, task_data }: { id: number; task_data: UpdateTaskDto }) => {
      try {
        const updated_task = await updateTask(id, task_data);
        updateTaskInStore(id, updated_task);
        showSuccess('Zadanie zostało zaktualizowane');
        return updated_task;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas aktualizacji zadania');
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Zadanie zostało zaktualizowane');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas aktualizacji zadania');
    }
  });

  const delete_task_mutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        await deleteTask(id);
        removeTask(id);
        return true;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas usuwania zadania');
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Zadanie zostało usunięte');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas usuwania zadania');
    }
  });

  const change_status_mutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: TaskStatus }) => {
      try {
        const updated_task = await updateTask(id, { status });
        updateTaskInStore(id, updated_task);
        showSuccess('Status zadania został zmieniony');
        return updated_task;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas zmiany statusu zadania');
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Status zadania został zmieniony');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas zmiany statusu zadania');
    }
  });

  return {
    tasks: tasks_query.data || tasks,
    is_loading: tasks_query.isLoading,
    is_error: tasks_query.isError,
    error: tasks_query.error,
    createTask: create_task_mutation.mutate,
    updateTask: update_task_mutation.mutate,
    deleteTask: delete_task_mutation.mutate,
    changeStatus: change_status_mutation.mutate,
    refreshTasks: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  };
}; 