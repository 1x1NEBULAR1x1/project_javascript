import { useTaskStore } from '../hooks/taskStore';
import { useTasks } from '../hooks/useTasks';
import type { TaskStatus } from '../hooks/tasksApi';

const CreateTask = () => {
  const { new_task, setNewTask } = useTaskStore(state => state);
  const { createTask } = useTasks();
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!new_task.title.trim()) return;

    createTask(new_task);
    setNewTask({ title: '', description: '', status: 'todo' });
  };

  return (
    <form className="task_form" onSubmit={handleCreateSubmit}>
      <h3>Dodaj nowe zadanie</h3>
      <div className="form_group">
        <label htmlFor="task_title">Tytuł:</label>
        <input
          id="task_title"
          type="text"
          value={new_task.title}
          onChange={(e) => setNewTask({ ...new_task, title: e.target.value })}
          placeholder="Nazwa zadania"
          required
        />
      </div>

      <div className="form_group">
        <label htmlFor="task_description">Opis:</label>
        <textarea
          id="task_description"
          value={new_task.description || ''}
          onChange={(e) => setNewTask({ ...new_task, description: e.target.value })}
          placeholder="Opis zadania"
        />
      </div>

      <div className="form_group">
        <label htmlFor="task_status">Status:</label>
        <select
          id="task_status"
          value={new_task.status}
          onChange={(e) => setNewTask({ ...new_task, status: e.target.value as TaskStatus })}
        >
          <option value="todo">Do zrobienia</option>
          <option value="in_progress">W trakcie</option>
          <option value="done">Zakończone</option>
        </select>
      </div>

      <button type="submit" className="btn_primary">Dodaj zadanie</button>
    </form>
  );
};

export { CreateTask };
