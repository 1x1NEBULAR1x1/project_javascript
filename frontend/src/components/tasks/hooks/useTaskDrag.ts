import { useState } from 'react';
import type { Task } from '../../../types';

interface UseTaskDragProps {
  onReorder: (reorderedTasks: Task[]) => void;
}

export const useTaskDrag = ({ onReorder }: UseTaskDragProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleReorder = (reorderedTasks: Task[]) => {
    onReorder(reorderedTasks);
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleReorder
  };
};

export default useTaskDrag; 