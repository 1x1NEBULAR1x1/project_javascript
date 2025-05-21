import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PomodoroSettings } from "./pomodoroApi";
import { usePomodoroStore } from "./usePomodoroStore";
import { useNotification } from "../../../notification/NotificationContext";
import { updatePomodoroSettings } from "./pomodoroApi";

export const useUpdatePomodoroSettings = () => {
  const { settings, setSettings, current_type, setTimer } = usePomodoroStore();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings_data: Partial<PomodoroSettings>) => {
      try {
        const updated_settings = await updatePomodoroSettings(settings_data);
        const new_settings = { ...settings, ...updated_settings };
        setSettings(new_settings);
        const updated_timer = current_type === 'work'
          ? new_settings.work_duration * 60
          : current_type === 'break'
            ? new_settings.break_duration * 60
            : new_settings.long_break_duration * 60;
        setTimer(updated_timer);
        showSuccess('Ustawienia zostały zaktualizowane');
        return new_settings;
      } catch (error: any) {
        showError(error.message || 'Błąd podczas aktualizacji ustawień');
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess('Ustawienia zostały zaktualizowane');
      queryClient.invalidateQueries({ queryKey: ['pomodoro', 'settings'] });
    },
    onError: (error: any) => {
      showError(error.message || 'Błąd podczas aktualizacji ustawień');
    }
  });

  return { updateSettings: updateSettingsMutation.mutate, is_loading: updateSettingsMutation.isPending, is_error: updateSettingsMutation.isError, error: updateSettingsMutation.error };
};