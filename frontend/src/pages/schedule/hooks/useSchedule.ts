import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useScheduleStore } from './useScheduleStore';
import { useNotification } from '../../../notification/NotificationContext';
import type { Schedule } from './scheduleApi';
import { fetchScheduleByDate, createSchedule } from './scheduleApi';

export const useSchedule = (date?: string) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  const {
    current_date,
    schedule,
    setCurrentDate,
    setSchedule,
    setDateScheduleMap,
  } = useScheduleStore();

  const actual_date = date || current_date;

  const fetchScheduleWrapper = async (): Promise<Schedule | null> => {
    try {
      if (date) setCurrentDate(date);

      const fetched_schedule = await fetchScheduleByDate(actual_date);

      setSchedule(fetched_schedule);

      if (fetched_schedule && fetched_schedule.id > 0) {
        setDateScheduleMap(actual_date, fetched_schedule.id);
      }
      showSuccess('Harmonogram został załadowany');
      return fetched_schedule;
    } catch (error: any) {
      showError(error.message || 'Błąd podczas ładowania harmonogramu');
      throw error;
    }
  };

  const schedule_query = useQuery<Schedule | null>({
    queryKey: ['schedule', actual_date],
    queryFn: fetchScheduleWrapper,
    initialData: actual_date === current_date ? schedule : null,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (schedule_data: Partial<Schedule>) => {
      try {
        const new_schedule = await createSchedule(schedule_data);

        setSchedule(new_schedule);

        if (new_schedule.id > 0 && new_schedule.date) {
          setDateScheduleMap(new_schedule.date, new_schedule.id);
        }
        showSuccess('Harmonogram został utworzony');
        return new_schedule;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas tworzenia harmonogramu');
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Harmonogram został utworzony');
      queryClient.invalidateQueries({ queryKey: ['schedule', actual_date] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas tworzenia harmonogramu');
    }
  });





  const changeDate = (new_date: string) => {
    setCurrentDate(new_date);
    queryClient.invalidateQueries({ queryKey: ['schedule', new_date] });
  };

  return {
    date: actual_date,
    schedule: schedule_query.data || schedule,
    is_loading: schedule_query.isLoading,
    is_error: schedule_query.isError,
    error: schedule_query.error,
    changeDate,
    createSchedule: createScheduleMutation.mutate,
    refreshSchedule: () => queryClient.invalidateQueries({ queryKey: ['schedule', actual_date] })
  };
}; 