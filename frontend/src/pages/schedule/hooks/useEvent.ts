import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEvent, deleteEvent, updateEvent } from "./scheduleApi";
import type { ScheduleEvent } from "./scheduleApi";
import { useNotification } from "../../../notification/NotificationContext";
import { useScheduleStore } from "./useScheduleStore";


export const useEvent = (date?: string) => {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const { updateScheduleEvent, current_date, addScheduleEvent, removeScheduleEvent } = useScheduleStore(state => state);
  const actual_date = date || current_date;

  const update_event_mutation = useMutation({
    mutationFn: async ({
      schedule_id,
      event_id,
      event_data
    }: {
      schedule_id: number;
      event_id: number;
      event_data: Partial<ScheduleEvent>
    }) => {
      try {
        const updated_event = await updateEvent(schedule_id, event_id, event_data);

        updateScheduleEvent(event_id, updated_event);
        showSuccess('Wydarzenie zostało zaktualizowane');
        return updated_event;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas aktualizacji wydarzenia');
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Wydarzenie zostało zaktualizowane');
      queryClient.invalidateQueries({ queryKey: ['schedule', actual_date] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas aktualizacji wydarzenia');
    }
  });

  const delete_event_mutation = useMutation({
    mutationFn: async ({ schedule_id, event_id }: { schedule_id: number; event_id: number }) => {
      try {
        await deleteEvent(schedule_id, event_id);
        removeScheduleEvent(event_id);
        showSuccess('Wydarzenie zostało usunięte');
        return true;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas usuwania wydarzenia');
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Wydarzenie zostało usunięte');
      queryClient.invalidateQueries({ queryKey: ['schedule', actual_date] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas usuwania wydarzenia');
    }
  });

  const add_event_mutation = useMutation({
    mutationFn: async ({ schedule_id, event_data }: { schedule_id: number; event_data: Partial<ScheduleEvent> }) => {
      try {
        const new_event = await addEvent(schedule_id, event_data);

        addScheduleEvent(new_event);
        showSuccess('Wydarzenie zostało dodane');
        return new_event;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas dodawania wydarzenia');
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Wydarzenie zostało dodane');
      queryClient.invalidateQueries({ queryKey: ['schedule', actual_date] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas dodawania wydarzenia');
    }
  });

  return {
    updateEvent: update_event_mutation.mutate,
    deleteEvent: delete_event_mutation.mutate,
    addEvent: add_event_mutation.mutate,
    is_loading: update_event_mutation.isPending || delete_event_mutation.isPending || add_event_mutation.isPending,
    is_error: update_event_mutation.isError || delete_event_mutation.isError || add_event_mutation.isError,
    error: update_event_mutation.error || delete_event_mutation.error || add_event_mutation.error,
  };
};