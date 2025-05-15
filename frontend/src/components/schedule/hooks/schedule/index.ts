import { useScheduleQuery } from './useScheduleQuery';
import { useScheduleRefresh } from './useScheduleRefresh';
import { useScheduleMutations } from './useScheduleMutations';
import { useEventMutations } from './useEventMutations';
import { useSortedEvents } from './useSortedEvents';
import type { UseScheduleProps } from './types';

/**
 * Główny hook do zarządzania harmonogramem
 * Integruje wszystkie funkcjonalności związane z harmonogramem
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

export * from './types';
export { useScheduleQuery, useScheduleRefresh, useScheduleMutations, useEventMutations, useSortedEvents }; 