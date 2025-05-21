import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPomodoroSessions, fetchPomodoroSessionsByDate, deletePomodoroSession } from './pomodoroApi';
import { useNotification } from '../../../notification/NotificationContext';
import { useMemo } from 'react';
import type { PomodoroSession } from './pomodoroApi';
import { usePomodoroStore } from './usePomodoroStore';
export interface SessionStatistics {
  total_work_time: number;
  total_break_time: number;
  total_long_break_time: number;
  work_sessions_count: number;
  break_sessions_count: number;
  long_break_sessions_count: number;
}

export const useSessionHistory = () => {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const { selected_date, setSelectedDate } = usePomodoroStore();

  const sessions_query = useQuery({
    queryKey: ['pomodoro', 'sessions', selected_date],
    queryFn: async () => {
      try {
        if (selected_date) {
          return await fetchPomodoroSessionsByDate(selected_date);
        } else {
          return await fetchPomodoroSessions();
        }
      } catch (error: any) {
        showError(error.message || 'Błąd podczas ładowania historii');
        throw error;
      }
    },
    refetchOnWindowFocus: false
  });

  const delete_mutation = useMutation({
    mutationFn: (id: number) => deletePomodoroSession(id),
    onSuccess: () => {
      showSuccess('Sesja usunięta');
      queryClient.invalidateQueries({ queryKey: ['pomodoro', 'sessions'] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas usuwania sesji');
    }
  });

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTypeName = (type: string): string => {
    switch (type) {
      case 'work': return 'Praca';
      case 'break': return 'Przerwa';
      case 'long_break': return 'Długa przerwa';
      default: return type;
    }
  };

  const calculate_statistics = (sessions: PomodoroSession[]): SessionStatistics => {
    const stats: SessionStatistics = {
      total_work_time: 0,
      total_break_time: 0,
      total_long_break_time: 0,
      work_sessions_count: 0,
      break_sessions_count: 0,
      long_break_sessions_count: 0
    };

    sessions.forEach(session => {
      switch (session.type) {
        case 'work':
          stats.total_work_time += session.duration;
          stats.work_sessions_count += 1;
          break;
        case 'break':
          stats.total_break_time += session.duration;
          stats.break_sessions_count += 1;
          break;
        case 'long_break':
          stats.total_long_break_time += session.duration;
          stats.long_break_sessions_count += 1;
          break;
      }
    });

    return stats;
  };

  const statistics = useMemo(() => {
    return calculate_statistics(sessions_query.data || []);
  }, [sessions_query.data]);

  return {
    sessions: sessions_query.data || [],
    is_loading: sessions_query.isLoading,
    is_error: sessions_query.isError,
    error: sessions_query.error,
    selected_date,
    setSelectedDate,
    deleteSession: delete_mutation.mutate,
    is_deleting: delete_mutation.isPending,
    refreshSessions: () => queryClient.invalidateQueries({ queryKey: ['pomodoro', 'sessions'] }),
    formatDuration,
    getSessionTypeName,
    statistics
  };
}; 