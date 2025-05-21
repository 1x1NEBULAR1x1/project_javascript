import type { FC } from 'react';
import type { Task, TaskStatus } from '../hooks/tasksApi';
import { useTaskStore } from '../hooks/taskStore';
import { useTasks } from '../hooks/useTasks';

interface TaskCardProps {
  task: Task;
}

const TaskCard: FC<TaskCardProps> = ({ task }) => {
  const { setEditTask } = useTaskStore(state => state);
  const { deleteTask, changeStatus } = useTasks();

  const handleChangeStatus = (task: Task, new_status: TaskStatus) => {
    changeStatus({ id: task.id, status: new_status });
  };

  const getStatusButton = (task: Task) => {
    switch (task.status) {
      case 'todo':
        return <button onClick={() => handleChangeStatus(task, 'in_progress')} className="btn_start">Rozpocznij</button>;
      case 'in_progress':
        return <button onClick={() => handleChangeStatus(task, 'done')} className="btn_complete">Zakończ</button>;
      case 'done':
        return <button onClick={() => handleChangeStatus(task, 'todo')} className="btn_complete">Wróć</button>;
    }
  };

  return (
    <div key={task.id} className="task_card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="task_actions">
        <button onClick={() => setEditTask(task)} className="btn_edit">Edytuj</button>
        <button onClick={() => deleteTask(task.id)} className="btn_delete">Usuń</button>
        {getStatusButton(task)}
      </div>
    </div>
  );
};

export { TaskCard };
