import { useMemo } from 'react';
import type { Schedule, ScheduleSlot } from '../../../../types';

/**
 * Hook sortujący wydarzenia w harmonogramie według czasu rozpoczęcia
 */
export const useSortedEvents = (schedule: Schedule | null | undefined) => {
  return useMemo(() => {
    if (!schedule || !schedule.slots) return [];

    // Sortujemy po czasie rozpoczęcia i tworzymy nową tablicę
    return [...schedule.slots].sort(
      (a: ScheduleSlot, b: ScheduleSlot) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  }, [schedule]);
}; 