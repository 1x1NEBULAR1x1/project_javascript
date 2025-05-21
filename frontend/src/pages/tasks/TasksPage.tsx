import { useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import './Tasks.css';
import { EditTask, CreateTask, TaskContainer } from './components';

const TasksPage = () => {
  const { tasks, is_loading, refreshTasks } = useTasks();

  useEffect(() => { refreshTasks() }, []);

  return is_loading ? (
    <div className="loading">Ładowanie zadań...</div>
  ) : (
    <div className="tasks_page">
      <h2>Lista zadań</h2>

      <CreateTask />

      <EditTask />

      <TaskContainer tasks={tasks} />

    </div>
  );
};

export default TasksPage; 