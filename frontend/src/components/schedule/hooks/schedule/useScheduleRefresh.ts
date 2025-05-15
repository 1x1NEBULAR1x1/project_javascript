import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchScheduleById } from '../../../../api/scheduleApi';

/**
 * Hook udostępniający funkcje do odświeżania danych harmonogramu
 */
export const useScheduleRefresh = (selectedDate: string) => {
  const queryClient = useQueryClient();

  const refreshScheduleById = useCallback(async (scheduleId: number) => {
    if (!scheduleId || scheduleId <= 0) {
      return;
    }

    const updatedSchedule = await fetchScheduleById(scheduleId);

    if (updatedSchedule) {
      queryClient.setQueryData(['schedule', selectedDate], updatedSchedule);
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
    }
  }, [queryClient, selectedDate]);

  return { refreshScheduleById };
}; 