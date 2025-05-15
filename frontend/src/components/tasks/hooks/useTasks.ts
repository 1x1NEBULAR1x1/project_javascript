import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task, UpdateTaskDto, CreateTaskDto } from '../../../types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../../api/tasksApi';
import { useEffect } from 'react';

interface UseTasksProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const useTasks = ({ onSuccess, onError }: UseTasksProps) => {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
    error
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    retry: 3,
    staleTime: 30000,
    gcTime: 60000,
  });

  useEffect(() => {
    if (error) {
      console.error('Błąd podczas ładowania zadań:', error);
      onError('Nie udało się załadować zadań. Sprawdź połączenie.');
    }
  }, [error, onError]);

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (taskData) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      optimisticAddTask(taskData);
      return { taskData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess('Zadanie zostało pomyślnie utworzone');
    },
    onError: (error: unknown) => {
      console.error('Błąd podczas tworzenia zadania:', error);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onError('Nie udało się utworzyć zadania');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];

      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map(task =>
          task.id === id
            ? { ...task, ...data, updated_at: new Date().toISOString() }
            : task
        )
      );

      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess('Zadanie zostało pomyślnie zaktualizowane');
    },
    onError: (error: unknown) => {
      console.error('Błąd podczas aktualizacji zadania:', error);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onError('Nie udało się zaktualizować zadania');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];

      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.filter(task => task.id !== id)
      );

      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess('Zadanie zostało pomyślnie usunięte');
    },
    onError: (error: unknown) => {
      console.error('Błąd podczas usuwania zadania:', error);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onError('Nie udało się usunąć zadania');
    },
  });

  const reorderTasks = (reorderedTasks: Task[]) => {
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      priority: index + 1
    }));

    queryClient.setQueryData<Task[]>(['tasks'], updatedTasks);

    updatedTasks.forEach(task => {
      updateTaskMutation.mutate({
        id: task.id,
        data: { priority: task.priority }
      });
    });
  };

  const optimisticAddTask = (taskData: CreateTaskDto) => {
    return queryClient.setQueryData<Task[]>(['tasks'], (oldTasks = []) => {
      const tmpTask: Task = {
        ...taskData,
        id: -Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        priority: taskData.priority || 1,
        status: taskData.status || 'todo'
      };
      return [tmpTask, ...oldTasks];
    });
  };

  return {
    tasks,
    isLoading,
    isError,
    refetch,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    reorderTasks
  };
};

export default useTasks; 