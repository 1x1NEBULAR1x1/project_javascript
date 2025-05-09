import { useState } from 'react';
import { motion, Reorder, useMotionValue, useTransform } from 'framer-motion';
import type { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onPriorityChange: (id: number, newPriority: number) => void;
}

const TaskItem = ({ task, onEdit, onDelete, onPriorityChange }: TaskItemProps) => {
  const [isDragging, setIsDragging] = useState(false);

  // Добавляем motion values для более естественной анимации
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-100, 0, 100], [-2, 0, 2]);
  const scale = useTransform(y, [-100, 0, 100], [0.98, 1, 0.98]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return '#ff9800';
      case 'in_progress': return '#2196f3';
      case 'done': return '#4caf50';
      default: return '#757575';
    }
  };

  // Обрабатываем начало перетаскивания
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Обрабатываем завершение перетаскивания
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Reorder.Item
      value={task}
      id={task.id.toString()}
      className="task-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isDragging ? 1.03 : 1,
        rotate: isDragging ? rotate.get() : 0,
        boxShadow: isDragging
          ? '0 12px 20px rgba(0, 0, 0, 0.3)'
          : '0 2px 5px rgba(0, 0, 0, 0.1)',
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 30
        }
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{
        scale: isDragging ? 1.03 : 1.02,
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.15)'
      }}
      dragTransition={{
        bounceStiffness: 300,
        bounceDamping: 20
      }}
      style={{
        position: 'relative',
        borderLeft: `5px solid ${getStatusColor(task.status)}`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 10 : 1,
        y,
        transition: "box-shadow 0.2s ease"
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragListener
      layoutId={`task-${task.id}`}
    >
      <motion.div
        className="task-content"
        animate={{
          opacity: isDragging ? 0.9 : 1,
          scale: isDragging ? 0.98 : 1
        }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        <div className="task-header">
          <h3>{task.title}</h3>
          <div className="task-badge">
            Priorytet: {task.priority}
          </div>
        </div>

        <p className="task-description">{task.description}</p>

        <div className="task-status">
          <span className="status-label" style={{ backgroundColor: getStatusColor(task.status) }}>
            {task.status === 'todo' ? 'Do zrobienia' :
              task.status === 'in_progress' ? 'W trakcie' : 'Zakończone'}
          </span>
        </div>

        <div className="task-actions">
          <button
            className="edit-button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            Edytuj
          </button>
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            Usuń
          </button>
        </div>
      </motion.div>
    </Reorder.Item>
  );
};

export default TaskItem; 