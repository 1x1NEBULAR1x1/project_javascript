import React from 'react';
import { usePomodoroStore } from '../hooks/usePomodoroStore';
import type { Task } from '../../tasks/hooks/tasksApi';

interface TaskSectionProps {
  tasks: Task[];
}

const TaskSection: React.FC<TaskSectionProps> = ({ tasks }) => {
  const { selected_task, setSelectedTask, active } = usePomodoroStore(state => state);

  return (
    <div className="task_selection">
      <label htmlFor="task_select">Wybierz zadanie:</label>
      <select
        id="task_select"
        value={selected_task || ''}
        onChange={(e) => setSelectedTask(e.target.value ? Number(e.target.value) : undefined)}
        disabled={active}
      >
        <option value="">-- Bez zadania --</option>
        {tasks
          .filter(task => task.status !== 'done')
          .map(task => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
      </select>
    </div>
  );
};

export { TaskSection };
