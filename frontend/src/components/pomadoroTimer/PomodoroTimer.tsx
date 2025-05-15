import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { usePomodoro } from './hooks/usePomodoro';
import type { PomodoroSettings } from '../../types';
import type { Task } from '../../types/task';
import { fetchTasks } from '../../api/tasksApi';
import './styles.css';

const PomodoroTimer = () => {
  const { showSuccess, showError } = useNotification();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [newSettings, setNewSettings] = useState<Partial<PomodoroSettings>>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const {
    settings,
    timerState,
    timerType,
    timeRemaining,
    completedPomodoros,
    selectedDate,
    sessionsByDate,
    isLoading,
    formatTime,
    getTimerLabel,
    calculateProgress,
    resetTimer,
    startTimer,
    pauseTimer,
    handleSkip,
    updateSettings,
    deleteSession,
    changeSelectedDate,
    getTotalWorkTime,
    getCompletedSessionsCount,
    setTaskForSession
  } = usePomodoro({
    onSuccess: showSuccess,
    onError: showError
  });

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksList = await fetchTasks();
        setTasks(tasksList);
      } catch (error) {
        showError('Nie udało się załadować zadań');
        console.error('Błąd podczas ładowania zadań:', error);
      }
    };

    loadTasks();
  }, [showError]);

  useEffect(() => {
    if (selectedTaskId) {
      setTaskForSession(selectedTaskId);
    }
  }, [selectedTaskId, setTaskForSession]);

  if (isLoading && !settings) {
    return (
      <div className="pomodoro-timer">
        <div className="loading">
          <div className="spinner"></div>
          <div>Ładowanie ustawień pomodoro...</div>
        </div>
      </div>
    );
  }

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(newSettings).length > 0) {
      console.log('Sending settings update:', newSettings);
      updateSettings(newSettings);
      setIsSettingsOpen(false);
      setNewSettings({});
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const taskId = e.target.value === "" ? null : parseInt(e.target.value, 10);
    setSelectedTaskId(taskId);
  };

  const sessionsArray = Array.isArray(sessionsByDate) ? sessionsByDate : [];

  console.log('Sessions data:', sessionsArray);

  return (
    <div className="pomodoro-container">
      <div className={`timer-section ${timerType}`}>
        <div className="timer-display">
          <h2>{getTimerLabel()}</h2>
          <div className="timer">{formatTime(timeRemaining)}</div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="pomodoro-count">
            Ukończone sesje: {completedPomodoros}
          </div>

          <div className="task-selector">
            <label htmlFor="task-select">Wybierz zadanie:</label>
            <select
              id="task-select"
              value={selectedTaskId || ""}
              onChange={handleTaskChange}
              disabled={timerState === 'running'}
            >
              <option value="">Bez zadania</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="timer-controls">
          {timerState === 'idle' && (
            <motion.button
              className="timer-button start"
              onClick={startTimer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Rozpocznij
            </motion.button>
          )}

          {timerState === 'running' && (
            <motion.button
              className="timer-button pause"
              onClick={pauseTimer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pauza
            </motion.button>
          )}

          {timerState === 'paused' && (
            <motion.button
              className="timer-button resume"
              onClick={startTimer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Wznów
            </motion.button>
          )}

          {timerState !== 'idle' && (
            <motion.button
              className="timer-button reset"
              onClick={resetTimer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resetuj
            </motion.button>
          )}

          <motion.button
            className="timer-button skip"
            onClick={handleSkip}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Pomiń
          </motion.button>
        </div>
      </div>

      <div className="settings-section">
        <h3>Ustawienia Pomodoro</h3>
        {settings && (
          <div className="settings-info">
            <div className="settings-row">
              <span>Czas pracy:</span>
              <span>{settings.work_duration} min</span>
            </div>
            <div className="settings-row">
              <span>Krótka przerwa:</span>
              <span>{settings.break_duration} min</span>
            </div>
            <div className="settings-row">
              <span>Długa przerwa:</span>
              <span>{settings.long_break_duration} min</span>
            </div>
            <div className="settings-row">
              <span>Interwał długiej przerwy:</span>
              <span>co {settings.long_break_interval} sesji</span>
            </div>
          </div>
        )}

        <motion.button
          className="settings-button"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Zmień ustawienia
        </motion.button>
      </div>

      <div className="history-button-section">
        <motion.button
          className="history-button"
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isHistoryOpen ? 'Zamknij historię' : 'Historia pracy'}
        </motion.button>
      </div>

      {isSettingsOpen && settings && (
        <motion.div
          className="settings-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3>Zmień ustawienia</h3>
          <form onSubmit={handleSettingsSubmit}>
            <div className="settings-group">
              <label htmlFor="work_duration">Czas pracy (min)</label>
              <input
                type="number"
                id="work_duration"
                name="work_duration"
                min="1"
                max="60"
                defaultValue={settings.work_duration}
                onChange={handleSettingsChange}
              />
            </div>

            <div className="settings-group">
              <label htmlFor="break_duration">Krótka przerwa (min)</label>
              <input
                type="number"
                id="break_duration"
                name="break_duration"
                min="1"
                max="30"
                defaultValue={settings.break_duration}
                onChange={handleSettingsChange}
              />
            </div>

            <div className="settings-group">
              <label htmlFor="long_break_duration">Długa przerwa (min)</label>
              <input
                type="number"
                id="long_break_duration"
                name="long_break_duration"
                min="1"
                max="60"
                defaultValue={settings.long_break_duration}
                onChange={handleSettingsChange}
              />
            </div>

            <div className="settings-group">
              <label htmlFor="long_break_interval">Interwał długiej przerwy</label>
              <input
                type="number"
                id="long_break_interval"
                name="long_break_interval"
                min="1"
                max="10"
                defaultValue={settings.long_break_interval}
                onChange={handleSettingsChange}
              />
            </div>

            <motion.button
              type="submit"
              className="settings-save"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Zapisz
            </motion.button>
          </form>
        </motion.div>
      )}

      {isHistoryOpen && (
        <motion.div
          className="history-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3>Historia pracy</h3>

          <div className="date-selector">
            <label htmlFor="history-date">Wybierz datę:</label>
            <input
              type="date"
              id="history-date"
              value={selectedDate}
              onChange={(e) => changeSelectedDate(e.target.value)}
            />
          </div>

          <div className="session-stats">
            <div className="stat">
              <span className="stat-label">Ukończone sesje:</span>
              <span className="stat-value">{getCompletedSessionsCount()}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Całkowity czas pracy:</span>
              <span className="stat-value">{Math.round(getTotalWorkTime())} min</span>
            </div>
          </div>

          <div className="session-list">
            <h4>Sesje dla {selectedDate}</h4>
            {sessionsArray.length === 0 ? (
              <p className="no-sessions">Brak sesji dla wybranej daty</p>
            ) : (
              <ul>
                {sessionsArray.map((session) => (
                  <li key={session.id} className={`session-item ${session.type}`}>
                    <div className="session-info">
                      <div className="session-type">
                        {session.type === 'work' ? 'Praca' :
                          session.type === 'break' ? 'Krótka przerwa' : 'Długa przerwa'}
                      </div>
                      {session.task_title !== undefined && session.task_title !== null && session.task_title !== '' ? (
                        <div className="session-task">
                          Zadanie: {session.task_title}
                        </div>
                      ) : session.task_id ? (
                        <div className="session-task">
                          Zadanie ID: {session.task_id} (bez tytułu)
                        </div>
                      ) : null}
                      <div className="session-time">
                        {new Date(session.start_time).toLocaleTimeString()}
                        {session.end_time && ` - ${new Date(session.end_time).toLocaleTimeString()}`}
                      </div>
                    </div>
                    <button
                      className="delete-session"
                      onClick={() => deleteSession(session.id)}
                    >
                      Usuń
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PomodoroTimer;
