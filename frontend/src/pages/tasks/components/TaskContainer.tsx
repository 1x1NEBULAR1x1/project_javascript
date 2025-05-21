import type { FC } from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '../hooks/tasksApi';

interface TaskContainerProps {
  tasks: Task[];
}

const TaskContainer: FC<TaskContainerProps> = ({ tasks }) => {

  return (
    <div className="tasks_container">
      <div className="task_column">
        <h3>Do zrobienia</h3>
        {tasks.filter(task => task.status === 'todo').map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <div className="task_column">
        <h3>W trakcie</h3>
        {tasks.filter(task => task.status === 'in_progress').map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <div className="task_column">
        <h3>Zakończone</h3>
        {tasks.filter(task => task.status === 'done').map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export { TaskContainer };
