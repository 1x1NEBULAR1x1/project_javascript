import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/Task';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasksApi';

type ErrorType = Error | unknown;

const TaskManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const queryClient = useQueryClient();

  // Запрос на получение задач
  const { data: tasks = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    retry: 3,
    staleTime: 30000, // 30 секунд
    gcTime: 60000, // 1 минута
    //@ts-ignore
    onError: (error: ErrorType) => {
      console.error('Błąd podczas ładowania zadań:', error);
      showNotification('error', 'Nie udało się załadować zadań. Sprawdź połączenie.');
    }
  });

  // Показ уведомления
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Мутация для создания задачи
  const createMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Сохраняем предыдущее состояние
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];

      // Оптимистично обновляем интерфейс
      const tempId = Date.now();
      const tempTask: Task = {
        id: tempId,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status || 'todo',
        priority: newTask.priority || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      queryClient.setQueryData<Task[]>(['tasks'], old => [...(old || []), tempTask]);

      // Закрываем форму
      setShowForm(false);

      // Возвращаем контекст для отката
      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showNotification('success', 'Zadanie zostało pomyślnie utworzone');
    },
    onError: (error: ErrorType) => {
      console.error('Błąd podczas tworzenia zadania:', error);
      // Отменяем оптимистичное обновление
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showNotification('error', 'Nie udało się utworzyć zadania');
    },
  });

  // Мутация для обновления задачи
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      updateTask(id, data),
    onMutate: async ({ id, data }) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Сохраняем предыдущее состояние
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];

      // Оптимистично обновляем интерфейс
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map(task =>
          task.id === id
            ? { ...task, ...data, updated_at: new Date().toISOString() }
            : task
        )
      );

      setEditingTask(null);
      setShowForm(false);

      // Возвращаем контекст для отката
      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showNotification('success', 'Zadanie zostało pomyślnie zaktualizowane');
    },
    onError: (error: ErrorType) => {
      console.error('Błąd podczas aktualizacji zadania:', error);
      // Отменяем оптимистичное обновление
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showNotification('error', 'Nie udało się zaktualizować zadania');
    },
  });

  // Мутация для удаления задачи
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Сохраняем предыдущее состояние
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];

      // Оптимистично обновляем интерфейс
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.filter(task => task.id !== id)
      );

      // Возвращаем контекст для отката
      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showNotification('success', 'Zadanie zostało pomyślnie usunięte');
    },
    onError: (error: ErrorType) => {
      console.error('Błąd podczas usuwania zadania:', error);
      // Отменяем оптимистичное обновление
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showNotification('error', 'Nie udało się usunąć zadania');
    },
  });

  // Обработчик создания/обновления задачи
  const handleSubmit = (taskData: CreateTaskDto) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: taskData });
    } else {
      createMutation.mutate(taskData);
    }
  };

  // Обработчик изменения приоритета через перетаскивание
  const handleReorder = (reorderedTasks: Task[]) => {
    // Создаем новый массив задач с обновленными приоритетами
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      priority: index + 1 // Приоритет считается сверху вниз (1 - высший приоритет)
    }));

    // Обновляем локальные данные сразу
    queryClient.setQueryData<Task[]>(['tasks'], updatedTasks);

    // Запускаем обновление задач с новыми приоритетами на сервере
    // Обновляем задачи по одной, чтобы не перегружать сервер
    updatedTasks.forEach(task => {
      updateMutation.mutate({
        id: task.id,
        data: { priority: task.priority }
      });
    });
  };

  // Обработчики событий перетаскивания для всего списка
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Открытие формы редактирования
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Обработчик удаления задачи
  const handleDelete = (id: number) => {
    if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      deleteMutation.mutate(id);
    }
  };

  // Отмена формы
  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Фильтрация задач
  const filteredTasks = filter
    ? (tasks as Task[]).filter((task: Task) => task.status === filter)
    : (tasks as Task[]);

  // Сортировка по приоритету (от высокого к низкому)
  const sortedTasks = [...filteredTasks].sort((a, b) => a.priority - b.priority);

  // Анимация контейнера
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
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="task-controls">
        <motion.button
          className="add-task-button"
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Utwórz nowe zadanie
        </motion.button>

        <div className="filter-controls">
          <button
            className={`filter-button ${filter === null ? 'active' : ''}`}
            onClick={() => setFilter(null)}
          >
            Wszystkie
          </button>
          <button
            className={`filter-button ${filter === 'todo' ? 'active' : ''}`}
            onClick={() => setFilter('todo')}
          >
            Do zrobienia
          </button>
          <button
            className={`filter-button ${filter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setFilter('in_progress')}
          >
            W trakcie
          </button>
          <button
            className={`filter-button ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
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
            onSubmit={handleSubmit}
            onCancel={handleCancel}
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
            {sortedTasks.map((task: Task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPriorityChange={() => { }} // Теперь не используется, т.к. приоритет изменяется через перетаскивание
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