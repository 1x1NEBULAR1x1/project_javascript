export interface PomodoroSettings {
  id: number;
  work_duration: number;
  break_duration: number;
  long_break_duration: number;
  long_break_interval: number;
}

export interface PomodoroSession {
  id: number;
  task_id: number | null;
  task_title?: string;
  start_time: string;
  end_time?: string;
  duration: number;
  type: 'work' | 'break' | 'long_break';
}