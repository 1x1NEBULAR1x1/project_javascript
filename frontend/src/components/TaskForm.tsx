import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Task, CreateTaskDto } from '../types/Task';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: CreateTaskDto) => void;
  onCancel: () => void;
}

const TaskForm = ({ task, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
      priority
    });
  };

  return (
    <motion.div
      className="task-form-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <form onSubmit={handleSubmit} className="task-form">
        <h2>{task ? 'Edytuj zadanie' : 'Utwórz nowe zadanie'}</h2>

        <div className="form-group">
          <label htmlFor="title">Nazwa</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Wprowadź nazwę zadania"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Opis</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Wprowadź opis zadania"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'todo' | 'in_progress' | 'done')}
          >
            <option value="todo">Do zrobienia</option>
            <option value="in_progress">W trakcie</option>
            <option value="done">Zakończone</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priorytet (1-10)</label>
          <input
            id="priority"
            type="number"
            min="1"
            max="10"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          />
        </div>

        <div className="form-actions">
          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {task ? 'Zapisz' : 'Utwórz'}
          </motion.button>

          <motion.button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Anuluj
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm; 