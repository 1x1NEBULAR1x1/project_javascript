import { useState, useMemo } from 'react';
import type { Task } from '../../../types';

type TaskStatusFilter = string | null;

export const useTaskFilters = (tasks: Task[] = []) => {
  const [filter, setFilter] = useState<TaskStatusFilter>(null);

  const filteredTasks = useMemo(() => {
    return filter
      ? tasks.filter(task => task.status === filter)
      : tasks;
  }, [tasks, filter]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => a.priority - b.priority);
  }, [filteredTasks]);

  const setStatusFilter = (status: TaskStatusFilter) => {
    setFilter(status);
  };

  return {
    filter,
    filteredTasks,
    sortedTasks,
    setStatusFilter
  };
};

export default useTaskFilters; 