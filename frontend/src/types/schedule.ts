export interface Schedule {
  id: number;
  title: string;
  description: string;
  date: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  slots?: ScheduleSlot[];
}

export interface ScheduleSlot {
  id: number;
  schedule_id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleEvent {
  id: number;
  schedule_id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
} 