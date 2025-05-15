import { useState } from 'react';
import type { Task, CreateTaskDto } from '../../../types';

interface UseTaskFormProps {
  onSubmit: (taskData: CreateTaskDto) => void;
}

export const useTaskForm = ({ onSubmit }: UseTaskFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openNewTaskForm = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const openEditTaskForm = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSubmit = (taskData: CreateTaskDto) => {
    onSubmit(taskData);
    closeForm();
  };

  return {
    showForm,
    editingTask,
    openNewTaskForm,
    openEditTaskForm,
    closeForm,
    handleFormSubmit
  };
};

export default useTaskForm; 