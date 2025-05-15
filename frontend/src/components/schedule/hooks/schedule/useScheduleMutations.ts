import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSchedule, updateSchedule, deleteSchedule } from '../../../../api/scheduleApi';
import type { Schedule } from '../../../../types';

/**
 * Hook obsługujący operacje CRUD dla harmonogramu
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

      // Tworzymy tymczasowy obiekt harmonogramu
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

      // Aktualizujemy dane lokalnie przed potwierdzeniem z serwera
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