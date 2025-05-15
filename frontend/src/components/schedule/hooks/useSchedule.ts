import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchScheduleByDate,
  fetchScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  addScheduleEvent,
  updateScheduleEvent,
  deleteScheduleEvent
} from '../../../api/scheduleApi';
import type { Schedule, ScheduleSlot, ScheduleEvent } from '../../../types';
import { useCallback, useMemo } from 'react';

// Typy parametrów
interface UseScheduleProps {
  selectedDate: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface AddEventParams {
  schedule_id: number;
  eventData: Partial<ScheduleEvent>;
}

interface UpdateEventParams {
  schedule_id: number;
  eventId: number;
  eventData: Partial<ScheduleEvent>;
}

interface DeleteEventParams {
  schedule_id: number;
  eventId: number;
}

/**
 * Hook do pobierania danych harmonogramu
 */
export const useScheduleQuery = (selectedDate: string) => {
  return useQuery({
    queryKey: ['schedule', selectedDate],
    queryFn: () => fetchScheduleByDate(selectedDate),
    retry: 3,
    staleTime: 60000,
  });
};

/**
 * Hook zwraca funkcje do odświeżania harmonogramu
 */
export const useScheduleRefresh = (selectedDate: string) => {
  const queryClient = useQueryClient();

  const refreshScheduleById = useCallback(async (scheduleId: number) => {
    try {
      if (!scheduleId || scheduleId <= 0) {
        return;
      }

      const updatedSchedule = await fetchScheduleById(scheduleId);

      if (updatedSchedule) {
        queryClient.setQueryData(['schedule', selectedDate], updatedSchedule);
        queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      }
    } catch (error) {
      // W przypadku błędu, nie robimy nic - komponenty nadrzędne powinny obsłużyć błędy
    }
  }, [queryClient, selectedDate]);

  return { refreshScheduleById };
};

/**
 * Hook dla mutacji związanych z harmonogramem
 */
export const useScheduleMutations = (
  selectedDate: string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();

  // Tworzenie harmonogramu
  const createScheduleMutation = useMutation({
    mutationFn: createSchedule,
    onMutate: async (scheduleData) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', selectedDate] });

      const tempSchedule: Schedule = {
        id: -Date.now(),
        title: scheduleData.title || `Harmonogram na ${selectedDate}`,
        description: scheduleData.description || 'Automatycznie utworzony harmonogram',
        date: selectedDate,
        start_date: scheduleData.start_date || `${selectedDate}T00:00:00`,
        end_date: scheduleData.end_date || `${selectedDate}T23:59:59`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        slots: []
      };

      queryClient.setQueryData(['schedule', selectedDate], tempSchedule);

      return { tempSchedule };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      onSuccess('Harmonogram został utworzony');
      return data;
    },
    onError: () => {
      onError('Nie udało się utworzyć harmonogramu');
    }
  });

  // Aktualizacja harmonogramu
  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, scheduleData }: { id: number; scheduleData: Partial<Schedule> }) =>
      updateSchedule(id, scheduleData),
    onMutate: async ({ id, scheduleData }) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', selectedDate] });

      const currentSchedule = queryClient.getQueryData<Schedule>(['schedule', selectedDate]);

      if (!currentSchedule) return {};

      const updatedSchedule = {
        ...currentSchedule,
        ...scheduleData,
        id,
        updated_at: new Date().toISOString()
      };

      queryClient.setQueryData(['schedule', selectedDate], updatedSchedule);

      return { currentSchedule };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      onSuccess('Harmonogram został zaktualizowany');
    },
    onError: () => {
      onError('Nie udało się zaktualizować harmonogramu');
    }
  });

  // Usuwanie harmonogramu
  const deleteScheduleMutation = useMutation({
    mutationFn: deleteSchedule,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', selectedDate] });

      const currentSchedule = queryClient.getQueryData<Schedule>(['schedule', selectedDate]);

      if (currentSchedule && currentSchedule.id === id) {
        queryClient.setQueryData(['schedule', selectedDate], null);
      }

      return { currentSchedule };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      onSuccess('Harmonogram został usunięty');
    },
    onError: () => {
      onError('Nie udało się usunąć harmonogramu');
    }
  });

  return {
    createSchedule: createScheduleMutation.mutate,
    createScheduleAsync: createScheduleMutation.mutateAsync,
    updateSchedule: updateScheduleMutation.mutate,
    deleteSchedule: deleteScheduleMutation.mutate,
  };
};

/**
 * Hook dla mutacji związanych z wydarzeniami w harmonogramie
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

      // Tworzenie tymczasowego wydarzenia z odpowiednim ID
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

      // Dodatkowe odświeżenie po 300ms aby upewnić się, że dane są aktualne
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

      // Aktualizacja konkretnego wydarzenia w lokalnym stanie
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

      // Usuwanie wydarzenia z lokalnego stanu
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

/**
 * Hook organizujący sortowanie wydarzeń w harmonogramie
 */
export const useSortedEvents = (schedule: Schedule | null | undefined) => {
  return useMemo(() => {
    // Sortowanie wydarzeń po czasie rozpoczęcia
    if (!schedule || !schedule.slots) return [];

    return [...schedule.slots].sort(
      (a: ScheduleSlot, b: ScheduleSlot) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  }, [schedule]);
};

/**
 * Główny hook do zarządzania harmonogramem
 */
export const useSchedule = ({ selectedDate, onSuccess, onError }: UseScheduleProps) => {
  // Pobieranie danych harmonogramu
  const { data: schedule, isLoading, error, refetch } = useScheduleQuery(selectedDate);

  // Funkcje odświeżania
  const { refreshScheduleById } = useScheduleRefresh(selectedDate);

  // Mutacje dla harmonogramu
  const scheduleMutations = useScheduleMutations(selectedDate, onSuccess, onError);

  // Mutacje dla wydarzeń
  const eventMutations = useEventMutations(selectedDate, onSuccess, onError, refreshScheduleById);

  // Posortowane wydarzenia
  const sortedEvents = useSortedEvents(schedule);

  return {
    schedule: schedule ? { ...schedule, slots: sortedEvents } : undefined,
    isLoading,
    error,
    refetchSchedule: refetch,
    refreshScheduleById,
    ...scheduleMutations,
    ...eventMutations,
  };
};

// Reeksport z nowej struktury
export * from './schedule'; 