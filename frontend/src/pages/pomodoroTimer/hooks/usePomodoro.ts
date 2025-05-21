import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useEffect, useState } from 'react';
import { usePomodoroStore } from './usePomodoroStore';
import { useNotification } from '../../../notification/NotificationContext';
import type { PomodoroSession } from './pomodoroApi';
import { fetchPomodoroSettings, createPomodoroSession, completePomodoroSession, updatePomodoroSession } from './pomodoroApi';

export const usePomodoro = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  const timer_ref = useRef<number | null>(null);
  const [elapsed_time, set_elapsed_time] = useState<number>(0);
  const start_time_ref = useRef<number>(0);
  const pause_time_ref = useRef<number>(0);

  const {
    settings,
    current_session,
    timer,
    active,
    current_type,
    pomodoro_count,
    setSettings,
    addSession,
    updateSession,
    setTimer,
    setActive,
    setCurrentType,
    setPomodoroCount,
    resetTimer,
    setCurrentSession,
  } = usePomodoroStore();

  useEffect(() => {
    return () => {
      if (timer_ref.current) {
        clearInterval(timer_ref.current);
      }
    };
  }, []);

  const settingsQuery = useQuery({
    queryKey: ['pomodoro', 'settings'],
    queryFn: async () => {
      try {
        const fetched_settings = await fetchPomodoroSettings();

        setSettings(fetched_settings);
        setTimer(fetched_settings.work_duration * 60);
        showSuccess('Ustawienia zostały załadowane');
        return fetched_settings;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas ładowania ustawień');
        throw error;
      }
    },
    initialData: settings,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  const startTimer = async (task_id?: number) => {
    if (active) return;

    try {
      const initial_duration = current_type === 'work'
        ? settings.work_duration * 60
        : current_type === 'break'
          ? settings.break_duration * 60
          : settings.long_break_duration * 60;

      // If we're resuming a paused session, don't create a new one
      if (!current_session) {
        const session_data: Partial<PomodoroSession> = {
          task_id,
          type: current_type,
          start_time: new Date().toISOString(),
          duration: initial_duration
        };

        const new_session = await createPomodoroSession(session_data);
        setCurrentSession(new_session);
        addSession(new_session);
        set_elapsed_time(0);
      }

      start_time_ref.current = Date.now();
      setActive(true);

      timer_ref.current = window.setInterval(() => {
        const current_timer = usePomodoroStore.getState().timer;
        if (current_timer <= 1) {
          handleTimerComplete();
          setTimer(0);
        } else {
          setTimer(current_timer - 1);
          set_elapsed_time(prev => prev + 1);
        }
      }, 1000);
    } catch (error: any) {
      showError(error.message || 'Błąd podczas rozpoczynania sesji Pomodoro');
    }
  };

  const pauseTimer = async () => {
    if (timer_ref.current) {
      clearInterval(timer_ref.current);
      timer_ref.current = null;
      setActive(false);
      pause_time_ref.current = Date.now();

      // Update session duration to current elapsed time
      if (current_session?.id) {
        try {
          await updatePomodoroSession(current_session.id, { duration: elapsed_time });
        } catch (error) {
          console.error('Error updating session duration:', error);
        }
      }
    }
  };

  const resetPomodoroTimer = async () => {
    if (timer_ref.current) {
      clearInterval(timer_ref.current);
      timer_ref.current = null;
    }

    setActive(false);

    // If there's an active session, complete it with the elapsed time
    if (current_session?.id) {
      try {
        await completePomodoroSession(current_session.id, elapsed_time);
      } catch (error) {
        console.error('Error completing session on reset:', error);
      }
    }

    setCurrentSession(null);
    set_elapsed_time(0);
    resetTimer();
  };

  const handleTimerComplete = async () => {
    if (timer_ref.current) {
      clearInterval(timer_ref.current);
      timer_ref.current = null;
    }

    setActive(false);

    try {
      if (current_session?.id) {
        await completePomodoroSession(current_session.id, elapsed_time);
        const completed_session = { ...current_session, duration: elapsed_time };
        updateSession(current_session.id, completed_session);
      }

      showSuccess(`Zakończono sesję ${current_type === 'work' ? 'pracy' : 'przerwy'}!`);

      if (current_type === 'work') {
        const new_count = pomodoro_count + 1;
        setPomodoroCount(new_count);

        if (new_count % settings.long_break_interval === 0) {
          setCurrentType('long_break');
        } else {
          setCurrentType('break');
        }
      } else {
        setCurrentType('work');
      }

      setCurrentSession(null);
      set_elapsed_time(0);
    } catch (error: any) {
      showError(error.message || 'Błąd podczas kończenia sesji');
    }
  };

  const skipTimer = () => {
    handleTimerComplete();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    settings: settingsQuery.data || settings,
    timer,
    active,
    current_type,
    pomodoro_count,
    current_session,
    is_loading: settingsQuery.isLoading,
    is_error: settingsQuery.isError,
    error: settingsQuery.error,
    formatTime,
    startTimer,
    pauseTimer,
    resetPomodoroTimer,
    skipTimer,
    setCurrentType,
    refreshSettings: () => queryClient.invalidateQueries({ queryKey: ['pomodoro', 'settings'] })
  };
}; 