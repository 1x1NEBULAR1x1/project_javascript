import { axiosInstance } from '../../../axiosConfig';

export interface PomodoroSettings {
  id?: number;
  work_duration: number;
  break_duration: number;
  long_break_duration: number;
  long_break_interval: number;
}

export interface PomodoroSession {
  id?: number;
  task_id: number;
  start_time: string;
  end_time?: string;
  duration: number;
  type: string;
}

export type PomodoroType = 'work' | 'break' | 'long_break';

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
    const response = await axiosInstance.get<ApiResponse<SettingsResponse> | PomodoroSettings>('/pomodoro/settings');

    if (response.data && typeof response.data === 'object' && 'data' in response.data &&
      response.data.data && 'settings' in response.data.data) {
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

    const response = await axiosInstance.put<ApiResponse<SettingsResponse> | PomodoroSettings>('/pomodoro/settings', settings);

    if (response.data && typeof response.data === 'object' && 'data' in response.data &&
      response.data.data && 'settings' in response.data.data) {
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
    const response = await axiosInstance.get<ApiResponse<SessionsResponse> | PomodoroSession[]>('/pomodoro/sessions');
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) &&
      'data' in response.data && response.data.data && 'sessions' in response.data.data) {
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
    const response = await axiosInstance.get<ApiResponse<SessionsResponse> | PomodoroSession[]>(`/pomodoro/sessions/${date}`);
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) &&
      'data' in response.data && response.data.data && 'sessions' in response.data.data) {
      return response.data.data.sessions;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    console.warn('Unexpected response format from sessions API:', response.data);
    return [];
  } catch (error) {
    console.error(`Error fetching pomodoro sessions for date ${date}:`, error);
    return [];
  }
};

export const createPomodoroSession = async (session: Partial<PomodoroSession>): Promise<PomodoroSession> => {
  try {
    const response = await axiosInstance.post<ApiResponse<SessionResponse> | PomodoroSession>('/pomodoro/sessions', session);
    if (response.data && typeof response.data === 'object' && 'data' in response.data &&
      response.data.data && 'session' in response.data.data) {
      return response.data.data.session;
    }
    return response.data as PomodoroSession;
  } catch (error) {
    console.error('Error creating pomodoro session:', error);
    throw error;
  }
};

export const completePomodoroSession = async (id: number, actual_duration?: number): Promise<PomodoroSession> => {
  try {
    const payload = actual_duration !== undefined ? { duration: actual_duration } : {};
    const response = await axiosInstance.put<ApiResponse<SessionResponse> | PomodoroSession>(`/pomodoro/sessions/${id}/complete`, payload);

    if (response.data && typeof response.data === 'object' && 'data' in response.data &&
      response.data.data && 'session' in response.data.data) {
      return response.data.data.session;
    }
    return response.data as PomodoroSession;
  } catch (error) {
    console.error(`Error completing pomodoro session ${id}:`, error);
    throw error;
  }
};

export const updatePomodoroSession = async (id: number, data: Partial<PomodoroSession>): Promise<PomodoroSession> => {
  try {
    const response = await axiosInstance.put<ApiResponse<SessionResponse> | PomodoroSession>(`/pomodoro/sessions/${id}`, data);

    if (response.data && typeof response.data === 'object' && 'data' in response.data &&
      response.data.data && 'session' in response.data.data) {
      return response.data.data.session;
    }
    return response.data as PomodoroSession;
  } catch (error) {
    console.error(`Error updating pomodoro session ${id}:`, error);
    throw error;
  }
};

export const deletePomodoroSession = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/pomodoro/sessions/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting pomodoro session ${id}:`, error);
    throw error;
  }
};