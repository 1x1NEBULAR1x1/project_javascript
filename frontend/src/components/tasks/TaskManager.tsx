import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import useTasks from './hooks/useTasks';
import useTaskFilters from './hooks/useTaskFilters';
import useTaskForm from './hooks/useTaskForm';
import useTaskDrag from './hooks/useTaskDrag';
import type { CreateTaskDto } from '../../types';

const TaskManager = () => {
  const { showSuccess, showError } = useNotification();

  const {
    tasks,
    isLoading,
    isError,
    refetch,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks
  } = useTasks({
    onSuccess: showSuccess,
    onError: showError
  });

  const {
    filter,
    sortedTasks,
    setStatusFilter
  } = useTaskFilters(tasks);

  const {
    showForm,
    editingTask,
    openNewTaskForm,
    openEditTaskForm,
    closeForm,
    handleFormSubmit
  } = useTaskForm({
    onSubmit: (taskData: CreateTaskDto) => {
      if (editingTask) {
        updateTask({ id: editingTask.id, data: taskData });
      } else {
        createTask(taskData);
      }
    }
  });

  const {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleReorder
  } = useTaskDrag({
    onReorder: reorderTasks
  });

  const handleDelete = (id: number) => {
    if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      deleteTask(id);
    }
  };

  const containerVariants = {
    normal: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      scale: 1,
      transition: { duration: 0.2 }
    },
    dragging: {
      backgroundColor: 'rgba(245, 245, 245, 0.95)',
      scale: 0.99,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="task-manager">
      <div className="task-controls">
        <motion.button
          className="add-task-button"
          onClick={openNewTaskForm}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Utwórz nowe zadanie
        </motion.button>

        <div className="filter-controls">
          <button
            className={`filter-button ${filter === null ? 'active' : ''}`}
            onClick={() => setStatusFilter(null)}
          >
            Wszystkie
          </button>
          <button
            className={`filter-button ${filter === 'todo' ? 'active' : ''}`}
            onClick={() => setStatusFilter('todo')}
          >
            Do zrobienia
          </button>
          <button
            className={`filter-button ${filter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in_progress')}
          >
            W trakcie
          </button>
          <button
            className={`filter-button ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setStatusFilter('done')}
          >
            Zakończone
          </button>

          <button
            className="refresh-button"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Odśwież
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <div>Ładowanie zadań...</div>
        </div>
      )}

      {isError && (
        <div className="error">
          <p>Błąd podczas ładowania zadań. Spróbuj ponownie później.</p>
          <button onClick={() => refetch()} className="retry-button">
            Ponów próbę
          </button>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="tasks-container"
        variants={containerVariants}
        animate={isDragging ? "dragging" : "normal"}
      >
        <Reorder.Group
          as="div"
          axis="y"
          values={sortedTasks}
          onReorder={handleReorder}
          layoutScroll
          className="tasks-list"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence mode="popLayout">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={openEditTaskForm}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>

          {sortedTasks.length === 0 && !isLoading && (
            <motion.div
              className="no-tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {filter
                ? `Brak zadań w kategorii "${filter === 'todo' ? 'Do zrobienia' : filter === 'in_progress' ? 'W trakcie' : 'Zakończone'}"`
                : 'Brak zadań. Utwórz nowe zadanie!'}
            </motion.div>
          )}
        </Reorder.Group>
      </motion.div>
    </div>
  );
};

export default TaskManager; 