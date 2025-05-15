import type { PomodoroSettings, PomodoroSession } from '../types';
import { api } from './baseApi';

interface ApiResponse<T> {
  status: string;
  data: T;
}

interface SessionsResponse {
  sessions: PomodoroSession[];
}

interface SettingsResponse {
  settings: PomodoroSettings;
}

interface SessionResponse {
  session: PomodoroSession;
}

export const fetchPomodoroSettings = async (): Promise<PomodoroSettings> => {
  try {
    const response = await api.get<ApiResponse<SettingsResponse> | PomodoroSettings>('/pomodoro/settings');

    if (response.data && 'data' in response.data && response.data.data && 'settings' in response.data.data) {
      return response.data.data.settings;
    }
    return response.data as PomodoroSettings;
  } catch (error) {
    console.error('Error fetching pomodoro settings:', error);
    throw error;
  }
};

export const updatePomodoroSettings = async (settings: Partial<PomodoroSettings>): Promise<PomodoroSettings> => {
  try {
    const apiSettings = {
      workDuration: settings.work_duration,
      breakDuration: settings.break_duration,
      longBreakDuration: settings.long_break_duration,
      longBreakInterval: settings.long_break_interval
    };

    console.log('Sending API settings:', apiSettings);
    const response = await api.put<ApiResponse<SettingsResponse> | PomodoroSettings>('/pomodoro/settings', apiSettings);

    if (response.data && 'data' in response.data && response.data.data && 'settings' in response.data.data) {
      return response.data.data.settings;
    }
    return response.data as PomodoroSettings;
  } catch (error) {
    console.error('Error updating pomodoro settings:', error);
    throw error;
  }
};

export const fetchPomodoroSessions = async (): Promise<PomodoroSession[]> => {
  try {
    const response = await api.get<ApiResponse<SessionsResponse> | PomodoroSession[]>('/pomodoro/sessions');

    if (response.data && 'data' in response.data && response.data.data && 'sessions' in response.data.data) {
      return response.data.data.sessions;
    }
    return response.data as PomodoroSession[];
  } catch (error) {
    console.error('Error fetching pomodoro sessions:', error);
    throw error;
  }
};

export const fetchPomodoroSessionsByDate = async (date: string): Promise<PomodoroSession[]> => {
  if (!date) {
    console.error('Date parameter is required for fetchPomodoroSessionsByDate');
    return [];
  }

  try {
    type ResponseType = ApiResponse<SessionsResponse> | { sessions: PomodoroSession[] } | PomodoroSession[];
    const response = await api.get<ResponseType>(`/pomodoro/sessions/${date}`);
    console.log('Session response data:', response.data);

    const data = response.data;

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if ('data' in data && data.data && typeof data.data === 'object' && 'sessions' in data.data) {
        return data.data.sessions;
      }

      if ('sessions' in data && Array.isArray(data.sessions)) {
        return data.sessions;
      }
    }

    if (Array.isArray(data)) {
      return data;
    }

    console.warn('Unexpected response format from sessions API:', data);
    return [];
  } catch (error) {
    console.error(`Error fetching pomodoro sessions for date ${date}:`, error);
    return [];
  }
};

export const createPomodoroSession = async (session: Partial<PomodoroSession>): Promise<PomodoroSession> => {
  try {
    const apiSession = {
      taskId: session.task_id,
      date: session.start_time,
      duration: session.duration,
      type: session.type
    };

    console.log('Sending session to API:', apiSession);

    const response = await api.post<ApiResponse<SessionResponse> | PomodoroSession>('/pomodoro/sessions', apiSession);

    console.log('API response:', response.data);

    if (response.data && 'data' in response.data && response.data.data && 'session' in response.data.data) {
      return response.data.data.session;
    }
    return response.data as PomodoroSession;
  } catch (error) {
    console.error('Error creating pomodoro session:', error);
    throw error;
  }
};

export const completePomodoroSession = async (id: number, end_time: string): Promise<PomodoroSession> => {
  try {
    const response = await api.put<ApiResponse<SessionResponse> | PomodoroSession>(
      `/pomodoro/sessions/${id}/complete`,
      { end_time: end_time }
    );

    if (response.data && 'data' in response.data && response.data.data && 'session' in response.data.data) {
      return response.data.data.session;
    }
    return response.data as PomodoroSession;
  } catch (error) {
    console.error(`Error completing pomodoro session ${id}:`, error);
    throw error;
  }
};

export const deletePomodoroSession = async (id: number): Promise<void> => {
  try {
    await api.delete(`/pomodoro/sessions/${id}`);
  } catch (error) {
    console.error(`Error deleting pomodoro session ${id}:`, error);
    throw error;
  }
};