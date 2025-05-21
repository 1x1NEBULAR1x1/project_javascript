import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CreateTaskDto, Task } from '../hooks/tasksApi';


interface TaskState {
  tasks: Task[];
  new_task: CreateTaskDto;
  edit_task: Task | null;

  setNewTask: (task: CreateTaskDto) => void;
  setEditTask: (task: Task | null) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTaskInStore: (id: number, updated_task: Task) => void;
  removeTask: (id: number) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      new_task: { title: '', description: '', status: 'todo' },
      edit_task: null,

      setNewTask: (task) => set({ new_task: task }),

      setEditTask: (task) => set({ edit_task: task }),

      setTasks: (tasks) => set({ tasks }),

      addTask: (task) => set(state => ({
        tasks: [...state.tasks, task]
      })),

      updateTaskInStore: (id, updated_task) => set(state => ({
        tasks: state.tasks.map(task => (task.id === id ? updated_task : task))
      })),

      removeTask: (id) => set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
    }),
    {
      name: 'task-storage'
    }
  )
); 