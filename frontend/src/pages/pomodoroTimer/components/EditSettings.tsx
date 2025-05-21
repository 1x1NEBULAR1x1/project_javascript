import { usePomodoroStore } from '../hooks/usePomodoroStore';
import { useUpdatePomodoroSettings } from '../hooks/useUpdatePomodoroSettings';

const EditSettings = () => {
  const { updateSettings } = useUpdatePomodoroSettings();
  const { edit_settings_data, setEditSettingsData, setEditSettings } = usePomodoroStore(state => state);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(edit_settings_data);
    setEditSettings(false);
  };

  return (
    <form className="settings_form" onSubmit={handleSettingsSubmit}>
      <div className="form_group">
        <label htmlFor="work_duration">Czas pracy (min):</label>
        <input
          id="work_duration"
          type="number"
          min="1"
          max="60"
          value={edit_settings_data.work_duration}
          onChange={(e) => setEditSettingsData({ ...edit_settings_data, work_duration: Number(e.target.value) })}
          required
        />
      </div>

      <div className="form_group">
        <label htmlFor="break_duration">Czas przerwy (min):</label>
        <input
          id="break_duration"
          type="number"
          min="1"
          max="30"
          value={edit_settings_data.break_duration}
          onChange={(e) => setEditSettingsData({ ...edit_settings_data, break_duration: Number(e.target.value) })}
          required
        />
      </div>

      <div className="form_group">
        <label htmlFor="long_break_duration">Czas długiej przerwy (min):</label>
        <input
          id="long_break_duration"
          type="number"
          min="1"
          max="60"
          value={edit_settings_data.long_break_duration}
          onChange={(e) => setEditSettingsData({ ...edit_settings_data, long_break_duration: Number(e.target.value) })}
          required
        />
      </div>

      <div className="form_group">
        <label htmlFor="long_break_interval">Interwał długiej przerwy:</label>
        <input
          id="long_break_interval"
          type="number"
          min="1"
          max="10"
          value={edit_settings_data.long_break_interval}
          onChange={(e) => setEditSettingsData({ ...edit_settings_data, long_break_interval: Number(e.target.value) })}
          required
        />
      </div>

      <button type="submit" className="btn_primary">Zapisz</button>
    </form>
  );
};

export { EditSettings };
