import { useTaskStore } from '../hooks/taskStore';
import type { UpdateTaskDto, TaskStatus } from '../hooks/tasksApi';
import { useTasks } from '../hooks/useTasks';


const EditTask = () => {
  const { edit_task, setEditTask } = useTaskStore(state => state);
  const { updateTask } = useTasks();
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit_task) return;

    const updated_data: UpdateTaskDto = {
      title: edit_task.title,
      description: edit_task.description,
      status: edit_task.status
    };

    updateTask({ id: edit_task.id, task_data: updated_data });
    setEditTask(null);
  };

  return edit_task && (
    <div className="edit_overlay">
      <div className="edit_modal">
        <h3>Edytuj zadanie</h3>
        <form onSubmit={handleUpdateSubmit}>
          <div className="form_group">
            <label htmlFor="edit_title">Tytuł:</label>
            <input
              id="edit_title"
              type="text"
              value={edit_task.title}
              onChange={(e) => setEditTask({ ...edit_task, title: e.target.value })}
              required
            />
          </div>

          <div className="form_group">
            <label htmlFor="edit_description">Opis:</label>
            <textarea
              id="edit_description"
              value={edit_task.description || ''}
              onChange={(e) => setEditTask({ ...edit_task, description: e.target.value })}
            />
          </div>

          <div className="form_group">
            <label htmlFor="edit_status">Status:</label>
            <select
              id="edit_status"
              value={edit_task.status}
              onChange={(e) => setEditTask({ ...edit_task, status: e.target.value as TaskStatus })}
            >
              <option value="todo">Do zrobienia</option>
              <option value="in_progress">W trakcie</option>
              <option value="done">Zakończone</option>
            </select>
          </div>

          <div className="form_actions">
            <button type="submit" className="btn_primary">Zapisz</button>
            <button
              type="button"
              className="btn_secondary"
              onClick={() => setEditTask(null)}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { EditTask };
