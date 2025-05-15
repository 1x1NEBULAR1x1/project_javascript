import { useQuery } from '@tanstack/react-query';
import { fetchScheduleByDate } from '../../../../api/scheduleApi';

/**
 * Hook do pobierania danych harmonogramu na podstawie daty
 */
export const useScheduleQuery = (selectedDate: string) => {
  return useQuery({
    queryKey: ['schedule', selectedDate],
    queryFn: () => fetchScheduleByDate(selectedDate),
    retry: 3,
    staleTime: 60000,
  });
}; 