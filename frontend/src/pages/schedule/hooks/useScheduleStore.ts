import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Schedule, ScheduleEvent } from './scheduleApi';


interface ScheduleState {
  current_date: string;
  schedule: Schedule | null;
  date_schedule_map: Record<string, number>;
  new_event: Partial<ScheduleEvent>;
  edit_event: ScheduleEvent | null;

  setNewEvent: (event: Partial<ScheduleEvent>) => void;
  setEditEvent: (event: ScheduleEvent | null) => void;
  setCurrentDate: (date: string) => void;
  setSchedule: (schedule: Schedule | null) => void;
  addScheduleEvent: (event: ScheduleEvent) => void;
  updateScheduleEvent: (event_id: number, updated_event: ScheduleEvent) => void;
  removeScheduleEvent: (event_id: number) => void;
  setDateScheduleMap: (date: string, schedule_id: number) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      current_date: new Date().toISOString().split('T')[0],
      schedule: null,
      date_schedule_map: {},
      new_event: {
        title: '',
        description: '',
        start_time: '',
        end_time: ''
      },
      edit_event: null,

      setNewEvent: (event) => set({ new_event: event }),

      setEditEvent: (event) => set({ edit_event: event }),

      setCurrentDate: (date) => set({ current_date: date }),

      setSchedule: (schedule) => set({ schedule }),

      addScheduleEvent: (event) => set(state => {
        const current_schedule = state.schedule;
        if (!current_schedule) return state;

        return {
          ...state,
          schedule: {
            ...current_schedule,
            events: [...(current_schedule.events || []), event]
          }
        };
      }),

      updateScheduleEvent: (event_id, updated_event) => set(state => {
        const current_schedule = state.schedule;
        if (!current_schedule) return state;

        return {
          ...state,
          schedule: {
            ...current_schedule,
            events: current_schedule.events?.map(event =>
              event.id === event_id ? updated_event : event
            ) || []
          }
        };
      }),

      removeScheduleEvent: (event_id) => set(state => {
        const current_schedule = state.schedule;
        if (!current_schedule) return state;

        return {
          ...state,
          schedule: {
            ...current_schedule,
            events: current_schedule.events?.filter(event => event.id !== event_id) || []
          }
        };
      }),

      setDateScheduleMap: (date, schedule_id) => set(state => ({
        date_schedule_map: {
          ...state.date_schedule_map,
          [`schedule_id_${date}`]: schedule_id
        }
      }))
    }),
    {
      name: 'schedule-storage',
      partialize: (state) => ({ date_schedule_map: state.date_schedule_map })
    }
  )
); 