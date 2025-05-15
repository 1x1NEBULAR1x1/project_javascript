import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addScheduleEvent, updateScheduleEvent, deleteScheduleEvent } from '../../../../api/scheduleApi';
import type { Schedule, ScheduleSlot } from '../../../../types';
import type { AddEventParams, UpdateEventParams, DeleteEventParams } from './types';

/**
 * Hook do zarządzania wydarzeniami w harmonogramie
 */
export const useEventMutations = (
  selectedDate: string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  refreshScheduleById: (id: number) => Promise<void>
) => {
  const queryClient = useQueryClient();

  // Dodawanie wydarzeń
  const addEventMutation = useMutation({
    mutationFn: ({ schedule_id, eventData }: AddEventParams) =>
      addScheduleEvent(schedule_id, eventData),
    onMutate: async ({ schedule_id, eventData }) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', selectedDate] });

      const currentSchedule = queryClient.getQueryData<Schedule>(['schedule', selectedDate]);

      if (!currentSchedule) return {};

      // Tworzenie tymczasowego wydarzenia do wyświetlenia przed odpowiedzią z serwera
      const tempEvent: ScheduleSlot = {
        id: -Date.now(),
        schedule_id: schedule_id,
        title: eventData.title || 'Nowe wydarzenie',
        description: eventData.description || '',
        start_time: eventData.start_time || new Date().toISOString(),
        end_time: eventData.end_time || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedSchedule = {
        ...currentSchedule,
        slots: [...(currentSchedule.slots || []), tempEvent]
      };

      queryClient.setQueryData(['schedule', selectedDate], updatedSchedule);

      return { currentSchedule };
    },
    onSuccess: (_, variables) => {
      refreshScheduleById(variables.schedule_id);
      onSuccess('Wydarzenie zostało dodane');

      // Dodatkowe odświeżenie dla zapewnienia aktualnych danych
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      }, 300);
    },
    onError: (_, variables) => {
      onError('Nie udało się dodać wydarzenia');
      refreshScheduleById(variables.schedule_id);
    }
  });

  // Aktualizacja wydarzeń
  const updateEventMutation = useMutation({
    mutationFn: ({ schedule_id, eventId, eventData }: UpdateEventParams) =>
      updateScheduleEvent(schedule_id, eventId, eventData),
    onMutate: async ({ schedule_id, eventId, eventData }) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', selectedDate] });

      const currentSchedule = queryClient.getQueryData<Schedule>(['schedule', selectedDate]);

      if (!currentSchedule || !currentSchedule.slots) return {};

      // Aktualizacja konkretnego wydarzenia lokalnie
      const updatedSchedule = {
        ...currentSchedule,
        slots: currentSchedule.slots.map(event =>
          event.id === eventId
            ? {
              ...event,
              ...eventData,
              id: eventId,
              schedule_id,
              updated_at: new Date().toISOString()
            }
            : event
        )
      };

      queryClient.setQueryData(['schedule', selectedDate], updatedSchedule);

      return { currentSchedule };
    },
    onSuccess: (_, variables) => {
      refreshScheduleById(variables.schedule_id);
      onSuccess('Wydarzenie zostało zaktualizowane');
    },
    onError: (_, variables) => {
      onError('Nie udało się zaktualizować wydarzenia');
      refreshScheduleById(variables.schedule_id);
    }
  });

  // Usuwanie wydarzeń
  const deleteEventMutation = useMutation({
    mutationFn: ({ schedule_id, eventId }: DeleteEventParams) =>
      deleteScheduleEvent(schedule_id, eventId),
    onMutate: async ({ eventId }) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', selectedDate] });

      const currentSchedule = queryClient.getQueryData<Schedule>(['schedule', selectedDate]);

      if (!currentSchedule || !currentSchedule.slots) return {};

      // Usuwanie wydarzenia lokalnie przed potwierdzeniem z serwera
      const updatedSchedule = {
        ...currentSchedule,
        slots: currentSchedule.slots.filter(event => event.id !== eventId)
      };

      queryClient.setQueryData(['schedule', selectedDate], updatedSchedule);

      return { currentSchedule };
    },
    onSuccess: (_, variables) => {
      refreshScheduleById(variables.schedule_id);
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      onSuccess('Wydarzenie zostało usunięte');
    },
    onError: (_, variables) => {
      onError('Nie udało się usunąć wydarzenia');
      refreshScheduleById(variables.schedule_id);
    }
  });

  return {
    addEvent: addEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
  };
}; 