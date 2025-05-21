import { useEffect } from 'react';
import { useSchedule } from './hooks/useSchedule';
import './Schedule.css';
import { EventsList, EditEvent, AddEvent } from './components';


const SchedulePage: React.FC = () => {

  const {
    date,
    schedule,
    is_loading,
    changeDate,
    createSchedule,
    refreshSchedule
  } = useSchedule();

  useEffect(() => {
    refreshSchedule();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeDate(e.target.value);
  };

  const handleCreateSchedule = () => {
    if (!schedule || schedule.id === 0) {
      createSchedule({
        title: `Harmonogram na ${date}`,
        description: '',
        date: date,
        start_date: `${date}T00:00:00`,
        end_date: `${date}T23:59:59`
      });
    }
  };

  const formatTime = (time_string: string) => {
    if (!time_string) return '';
    if (time_string.includes('T')) {
      return time_string.split('T')[1].substring(0, 5);
    }
    return time_string;
  };

  return (
    <div className="schedule_page">
      <h2>Harmonogram</h2>
      <div className="schedule_header">
        <div className="date_selector">
          <label htmlFor="schedule_date">Data:</label>
          <input
            id="schedule_date"
            type="date"
            value={date}
            onChange={handleDateChange}
          />
        </div>

        {(!schedule || schedule.id === 0) && (
          <button
            className="btn_primary"
            onClick={handleCreateSchedule}
          >
            Utwórz harmonogram
          </button>
        )}
      </div>

      {schedule && (
        <>
          <div style={{ display: 'flex', width: '100%' }}>
            <div className="schedule_info">
              <h3>{schedule.title}</h3>
              {schedule.description && <p>{schedule.description}</p>}
              <EventsList schedule={schedule} is_loading={is_loading} formatTime={formatTime} />
            </div>

            <AddEvent schedule={schedule} handleCreateSchedule={handleCreateSchedule} />
          </div>

          <EditEvent formatTime={formatTime} schedule={schedule} />
        </>
      )}
    </div>
  );
};

export default SchedulePage; 