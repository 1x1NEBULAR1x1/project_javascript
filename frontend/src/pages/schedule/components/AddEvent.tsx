import type { Schedule } from '../hooks/scheduleApi';
import { useEvent } from '../hooks/useEvent';
import { useScheduleStore } from '../hooks/useScheduleStore';

interface AddEventProps {
  schedule: Schedule;
  handleCreateSchedule: () => void;
}

const AddEvent: React.FC<AddEventProps> = ({ schedule, handleCreateSchedule }) => {
  const { new_event, setNewEvent } = useScheduleStore(state => state);
  const { addEvent } = useEvent();
  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!schedule || schedule.id === 0) {
      handleCreateSchedule();
      if (!schedule) return;
    }

    if (!new_event.title || !new_event.start_time || !new_event.end_time) {
      return;
    }

    addEvent({
      schedule_id: schedule.id,
      event_data: new_event
    });

    setNewEvent({
      title: '',
      description: '',
      start_time: '',
      end_time: ''
    });
  };

  return (
    <form className="event_form" onSubmit={handleEventSubmit}>
      <h3>Dodaj nowe wydarzenie</h3>
      <div className="form_group">
        <label htmlFor="event_title">Tytuł:</label>
        <input
          id="event_title"
          type="text"
          value={new_event.title || ''}
          onChange={(e) => setNewEvent({ ...new_event, title: e.target.value })}
          placeholder="Nazwa wydarzenia"
          required
        />
      </div>

      <div className="form_group">
        <label htmlFor="event_description">Opis:</label>
        <textarea
          id="event_description"
          value={new_event.description || ''}
          onChange={(e) => setNewEvent({ ...new_event, description: e.target.value })}
          placeholder="Opis wydarzenia"
        />
      </div>

      <div className="form_row">
        <div className="form_group">
          <label htmlFor="event_start">Początek:</label>
          <input
            id="event_start"
            type="time"
            value={new_event.start_time || ''}
            onChange={(e) => setNewEvent({ ...new_event, start_time: e.target.value })}
            required
          />
        </div>

        <div className="form_group">
          <label htmlFor="event_end">Koniec:</label>
          <input
            id="event_end"
            type="time"
            value={new_event.end_time || ''}
            onChange={(e) => setNewEvent({ ...new_event, end_time: e.target.value })}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn_primary">Dodaj wydarzenie</button>
    </form>
  );
};

export { AddEvent };
