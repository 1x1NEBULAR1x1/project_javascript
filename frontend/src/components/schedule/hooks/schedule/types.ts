import type { ScheduleEvent } from '../../../../types';

export interface UseScheduleProps {
  selectedDate: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export interface AddEventParams {
  schedule_id: number;
  eventData: Partial<ScheduleEvent>;
}

export interface UpdateEventParams {
  schedule_id: number;
  eventId: number;
  eventData: Partial<ScheduleEvent>;
}

export interface DeleteEventParams {
  schedule_id: number;
  eventId: number;
} 