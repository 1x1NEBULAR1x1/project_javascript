import { useState } from 'react';
import { useSessionHistory } from '../hooks/useSessionHistory';
import type { PomodoroSession } from '../hooks/pomodoroApi';

export const SessionHistory: React.FC = () => {
  const {
    sessions,
    is_loading,
    selected_date,
    setSelectedDate,
    deleteSession,
    is_deleting,
    formatDuration,
    getSessionTypeName,
    refreshSessions,
    statistics
  } = useSessionHistory();

  const [date_input, setDateInput] = useState<string>(
    selected_date || new Date().toISOString().split('T')[0]
  );

  const handleDateFilter = () => {
    setSelectedDate(date_input);
  };

  const handleReset = () => {
    setSelectedDate(null);
    setDateInput(new Date().toISOString().split('T')[0]);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  const formatTimeHoursMinutes = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} godz. ${minutes} min.`;
    }
    return `${minutes} min.`;
  };

  if (is_loading) {
    return <div className="loading">Ładowanie sesji...</div>;
  }

  return (
    <div className="session_history">
      <h3>Historia sesji</h3>

      <div className="filter_controls">
        <input
          type="date"
          value={date_input}
          onChange={(e) => setDateInput(e.target.value)}
        />
        <button onClick={handleDateFilter}>Filtruj</button>
        <button onClick={handleReset}>Resetuj</button>
        <button onClick={refreshSessions}>Aktualizuj</button>
      </div>

      {selected_date && (
        <div className="filter_info">
          Pokazane sesje z: {selected_date}
        </div>
      )}

      <div className="statistics_section">
        <h4>Statystyka</h4>
        <div className="statistics_grid">
          <div className="stat_item">
            <span className="stat_label">Sesje pracy:</span>
            <span className="stat_value">{statistics.work_sessions_count}</span>
          </div>
          <div className="stat_item">
            <span className="stat_label">Czas pracy łącznie:</span>
            <span className="stat_value">{formatTimeHoursMinutes(statistics.total_work_time)}</span>
          </div>
          <div className="stat_item">
            <span className="stat_label">Sesje przerw:</span>
            <span className="stat_value">{statistics.break_sessions_count}</span>
          </div>
          <div className="stat_item">
            <span className="stat_label">Czas przerw łącznie:</span>
            <span className="stat_value">{formatTimeHoursMinutes(statistics.total_break_time)}</span>
          </div>
          <div className="stat_item">
            <span className="stat_label">Sesje długich przerw:</span>
            <span className="stat_value">{statistics.long_break_sessions_count}</span>
          </div>
          <div className="stat_item">
            <span className="stat_label">Czas długich przerw łącznie:</span>
            <span className="stat_value">{formatTimeHoursMinutes(statistics.total_long_break_time)}</span>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="no_sessions">Brak dostępnych sesji</div>
      ) : (
        <div className="sessions_list">
          <table>
            <thead>
              <tr>
                <th>Typ</th>
                <th>Początek</th>
                <th>Długość</th>
                <th>ID zadania</th>
                <th>Działania</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session: PomodoroSession) => (
                <tr key={session.id}>
                  <td>{getSessionTypeName(session.type)}</td>
                  <td>{formatDateTime(session.start_time)}</td>
                  <td>{formatDuration(session.duration)}</td>
                  <td>{session.task_id || 'N/A'}</td>
                  <td>
                    <button
                      className="delete_btn"
                      onClick={() => session.id && deleteSession(session.id)}
                      disabled={is_deleting}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 