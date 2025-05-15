import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PomodoroSettings, PomodoroSession } from '../../../types';
import {
  fetchPomodoroSettings,
  updatePomodoroSettings,
  createPomodoroSession,
  completePomodoroSession,
  fetchPomodoroSessionsByDate,
  deletePomodoroSession
} from '../../../api/pomodoroApi';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';
export type TimerType = 'work' | 'break' | 'long_break';

interface UsePomodoroProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const usePomodoro = ({ onSuccess, onError }: UsePomodoroProps) => {
  const queryClient = useQueryClient();
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timerType, setTimerType] = useState<TimerType>('work');
  const [timeRemaining, setTimeRemaining] = useState<number>(25 * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [lastTick, setLastTick] = useState<number>(0);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  const { data: settings } = useQuery({
    queryKey: ['pomodoroSettings'],
    queryFn: fetchPomodoroSettings,
    retry: 3,
    staleTime: 300000,
  });

  const { data: sessionsByDate = [] } = useQuery<PomodoroSession[]>({
    queryKey: ['pomodoroSessions', selectedDate],
    queryFn: () => fetchPomodoroSessionsByDate(selectedDate),
    retry: 3,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updatePomodoroSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoroSettings'] });
      onSuccess('Ustawienia pomodoro zostały zaktualizowane');
    },
    onError: (error: unknown) => {
      console.error('Błąd podczas aktualizacji ustawień pomodoro:', error);
      onError('Nie udało się zaktualizować ustawień pomodoro');
    }
  });

  const createSessionMutation = useMutation({
    mutationFn: createPomodoroSession,
    onMutate: async (sessionData) => {
      await queryClient.cancelQueries({ queryKey: ['pomodoroSessions'] });

      const tempId = Date.now();
      const tempSession: PomodoroSession = {
        id: tempId,
        task_id: sessionData.task_id || null,
        start_time: sessionData.start_time || new Date().toISOString(),
        duration: sessionData.duration || 25,
        type: sessionData.type || 'work',
      };

      return { tempSession };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] });
      setActiveSessionId(data.id);
      onSuccess('Sesja pomodoro została utworzona');
    },
    onError: (error: unknown) => {
      console.error('Błąd podczas tworzenia sesji pomodoro:', error);
      onError('Nie udało się utworzyć sesji pomodoro');
    }
  });

  const completeSessionMutation = useMutation({
    mutationFn: ({ id, end_time }: { id: number, end_time: string }) =>
      completePomodoroSession(id, end_time),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] });
      setActiveSessionId(null);
      onSuccess('Sesja pomodoro została zakończona');
    },
    onError: (error: unknown) => {
      console.error('Błąd podczas zakończenia sesji pomodoro:', error);
      onError('Nie udało się zakończyć sesji pomodoro');
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: deletePomodoroSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] });
      onSuccess('Sesja pomodoro została usunięta');
    },
    onError: (error: unknown) => {
      console.error('Błąd podczas usuwania sesji pomodoro:', error);
      onError('Nie udało się usunąć sesji pomodoro');
    }
  });

  useEffect(() => {
    if (settings) {
      resetTimer();
    }
  }, [settings, timerType]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getCurrentTimerDuration = (): number => {
    if (!settings) return 25 * 60;

    if (timerType === 'work') {
      return settings.work_duration * 60;
    } else if (timerType === 'break') {
      return settings.break_duration * 60;
    } else {
      return settings.long_break_duration * 60;
    }
  };

  const resetTimer = () => {
    if (!settings) return;

    const newTime = getCurrentTimerDuration();
    setTimeRemaining(newTime);
    setTimerState('idle');

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    if (timerState === 'running') return;

    setTimerState('running');
    setLastTick(Date.now());

    if (timerType === 'work') {
      const sessionData = {
        task_id: selectedTaskId,
        start_time: new Date().toISOString(),
        duration: settings?.work_duration || 25,
        type: timerType
      };

      console.log('Creating session with task_id:', selectedTaskId);
      console.log('Session data:', sessionData);

      createSessionMutation.mutate(sessionData);
    }

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastTick;
      setLastTick(now);

      if (deltaTime >= 1000) {
        const secondsToDecrement = Math.floor(deltaTime / 1000);

        setTimeRemaining(prev => {
          if (prev <= secondsToDecrement) {
            handleTimerComplete();
            return 0;
          }
          return prev - secondsToDecrement;
        });
      }
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerState !== 'running') return;

    setTimerState('paused');

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimerComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimerState('completed');

    if (activeSessionId) {
      completeSessionMutation.mutate({
        id: activeSessionId,
        end_time: new Date().toISOString()
      });
    }

    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.error('Błąd odtwarzania dźwięku:', e));

    if (timerType === 'work') {
      setCompletedPomodoros(prev => {
        const newCount = prev + 1;
        if (newCount % (settings?.long_break_interval || 4) === 0) {
          setTimerType('long_break');
          onSuccess('Czas na długą przerwę!');
        } else {
          setTimerType('break');
          onSuccess('Czas na krótką przerwę!');
        }
        return newCount;
      });
    } else {
      setTimerType('work');
      onSuccess('Czas wrócić do pracy!');
    }
  };

  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (activeSessionId) {
      completeSessionMutation.mutate({
        id: activeSessionId,
        end_time: new Date().toISOString()
      });
    }

    if (timerType === 'work') {
      setTimerType('break');
    } else {
      setTimerType('work');
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerLabel = (): string => {
    switch (timerType) {
      case 'work':
        return 'Czas pracy';
      case 'break':
        return 'Krótka przerwa';
      case 'long_break':
        return 'Długa przerwa';
    }
  };

  const calculateProgress = (): number => {
    if (!settings) return 0;
    const totalTime = getCurrentTimerDuration();
    return Math.min(100, Math.max(0, (1 - timeRemaining / totalTime) * 100));
  };

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    updateSettingsMutation.mutate(newSettings);
  };

  const deleteSession = (sessionId: number) => {
    deleteSessionMutation.mutate(sessionId);
  };

  const changeSelectedDate = (date: string) => {
    setSelectedDate(date);
  };

  const setTaskForSession = (taskId: number | null) => {
    setSelectedTaskId(taskId);
  };

  const getTotalWorkTime = (): number => {
    if (!Array.isArray(sessionsByDate)) {
      console.error('sessionsByDate is not an array:', sessionsByDate);
      return 0;
    }

    return sessionsByDate
      .filter(session => session.type === 'work' && session.end_time)
      .reduce((total, session) => {
        if (session.end_time) {
          const startTime = new Date(session.start_time).getTime();
          const endTime = new Date(session.end_time).getTime();
          const durationMs = endTime - startTime;
          return total + (durationMs / 60000);
        }
        return total;
      }, 0);
  };

  const getCompletedSessionsCount = (): number => {
    if (!Array.isArray(sessionsByDate)) {
      console.error('sessionsByDate is not an array:', sessionsByDate);
      return 0;
    }

    return sessionsByDate.filter(session =>
      session.type === 'work' && session.end_time
    ).length;
  };

  return {
    settings,
    timerState,
    timerType,
    timeRemaining,
    completedPomodoros,
    activeSessionId,
    selectedDate,
    sessionsByDate,
    isLoading: createSessionMutation.isPending ||
      completeSessionMutation.isPending ||
      deleteSessionMutation.isPending,
    formatTime,
    getTimerLabel,
    calculateProgress,
    resetTimer,
    startTimer,
    pauseTimer,
    handleSkip,
    updateSettings,
    deleteSession,
    changeSelectedDate,
    getTotalWorkTime,
    getCompletedSessionsCount,
    setTaskForSession
  };
}; 