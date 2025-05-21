import { useEffect } from 'react';
import { usePomodoro } from './hooks/usePomodoro';
import { useTasks } from '../tasks/hooks/useTasks';
import './Pomodoro.css';
import { usePomodoroStore } from './hooks/usePomodoroStore';
import { EditSettings, ShowSettings, TaskSection, TimerControls, TimerType, SessionHistory } from './components';

const PomodoroPage: React.FC = () => {
  const { edit_settings, setEditSettings, setEditSettingsData } = usePomodoroStore(state => state);

  const { tasks, is_loading: tasks_loading } = useTasks();
  const {
    settings,
    timer,
    pomodoro_count,
    is_loading,
    formatTime,
    refreshSettings
  } = usePomodoro();

  useEffect(() => {
    refreshSettings();
    setEditSettingsData(settings);
  }, []);

  useEffect(() => {
    setEditSettingsData(settings);
  }, [settings]);


  const loading = is_loading || tasks_loading;

  if (loading) {
    return <div className="loading">Ładowanie...</div>;
  }

  return (
    <div className="pomodoro_page">
      <h2>Pomodoro Timer</h2>

      <div className="pomodoro_container">
        <TimerType />

        <div className="timer_display">
          <div className="time">{formatTime(timer)}</div>
          <div className="pomodoro_count">Cykl: {pomodoro_count}</div>
        </div>

        <TaskSection tasks={tasks} />
        <TimerControls />
      </div>
      <div className="pomodoro_settings">
        <div className="settings_header">
          <h3>Ustawienia</h3>
          <button
            className="btn_edit"
            onClick={() => {
              if (edit_settings) {
                setEditSettingsData(settings);
              }
              setEditSettings(!edit_settings);
            }}
          >
            {edit_settings ? 'Anuluj' : 'Edytuj'}
          </button>
        </div>

        {edit_settings ? (
          <EditSettings />
        ) : (
          <ShowSettings settings={settings} />
        )}
      </div>

      <div className="pomodoro_history_section">
        <SessionHistory />
      </div>
    </div>
  );
};

export default PomodoroPage; 