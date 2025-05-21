import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PomodoroSettings, PomodoroSession, PomodoroType } from './pomodoroApi';

interface PomodoroState {
  settings: PomodoroSettings;
  sessions: PomodoroSession[];
  current_session: PomodoroSession | null;
  timer: number;
  active: boolean;
  current_type: PomodoroType;
  pomodoro_count: number;
  selected_task: number | undefined;
  edit_settings: boolean;
  edit_settings_data: PomodoroSettings;
  selected_date: string | null;

  setSelectedDate: (date: string | null) => void;
  setSelectedTask: (task: number | undefined) => void;
  setEditSettings: (edit: boolean) => void;
  setEditSettingsData: (data: PomodoroSettings) => void;
  setSettings: (settings: PomodoroSettings) => void;
  setSessions: (sessions: PomodoroSession[]) => void;
  addSession: (session: PomodoroSession) => void;
  updateSession: (id: number, session: PomodoroSession) => void;
  removeSession: (id: number) => void;
  setTimer: (time: number) => void;
  setActive: (active: boolean) => void;
  setCurrentType: (type: PomodoroType) => void;
  setPomodoroCount: (count: number) => void;
  resetTimer: () => void;
  setCurrentSession: (session: PomodoroSession | null) => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      settings: {
        id: 0,
        work_duration: 25,
        break_duration: 5,
        long_break_duration: 15,
        long_break_interval: 4
      },
      sessions: [],
      current_session: null,
      timer: 25 * 60,
      active: false,
      current_type: 'work',
      pomodoro_count: 0,
      selected_task: undefined,
      edit_settings: false,
      edit_settings_data: {
        work_duration: 25,
        break_duration: 5,
        long_break_duration: 15,
        long_break_interval: 4
      },
      selected_date: null,

      setSelectedDate: (date) => set({ selected_date: date }),
      setSelectedTask: (task) => set({ selected_task: task }),

      setEditSettings: (edit) => set({ edit_settings: edit }),

      setEditSettingsData: (data) => set({ edit_settings_data: data }),

      setSettings: (settings) => set({ settings }),

      setSessions: (sessions) => set({ sessions }),

      addSession: (session) => set(state => ({
        sessions: [...state.sessions, session],
        current_session: session
      })),

      updateSession: (id, session) => set(state => ({
        sessions: state.sessions.map(s => s.id === id ? session : s)
      })),

      removeSession: (id) => set(state => ({
        sessions: state.sessions.filter(s => s.id !== id)
      })),

      setTimer: (time) => set({ timer: time }),

      setActive: (active) => set({ active }),

      setCurrentType: (type) => set(state => ({
        current_type: type,
        timer: type === 'work'
          ? state.settings.work_duration * 60
          : type === 'break'
            ? state.settings.break_duration * 60
            : state.settings.long_break_duration * 60
      })),

      setPomodoroCount: (count) => set({ pomodoro_count: count }),

      resetTimer: () => set(state => ({
        timer: state.current_type === 'work'
          ? state.settings.work_duration * 60
          : state.current_type === 'break'
            ? state.settings.break_duration * 60
            : state.settings.long_break_duration * 60
      })),

      setCurrentSession: (session) => set({ current_session: session }),
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        settings: state.settings,
        sessions: state.sessions,
        timer: state.timer,
        current_type: state.current_type,
        pomodoro_count: state.pomodoro_count
      })
    }
  )
); 