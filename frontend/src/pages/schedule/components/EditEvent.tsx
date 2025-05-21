import React from 'react';
import { useScheduleStore } from '../hooks/useScheduleStore';
import { useEvent } from '../hooks/useEvent';
import type { Schedule } from '../hooks/scheduleApi';

interface EditEventProps {
  formatTime: (time_string: string) => string;
  schedule: Schedule;
}

const EditEvent: React.FC<EditEventProps> = ({ formatTime, schedule }) => {
  const { edit_event, setEditEvent } = useScheduleStore(state => state);
  const { updateEvent } = useEvent();

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit_event || !schedule) return;

    updateEvent({
      schedule_id: schedule.id,
      event_id: edit_event.id,
      event_data: edit_event
    });

    setEditEvent(null);
  };

  return edit_event && (
    <div className="edit_overlay">
      <div className="edit_modal">
        <h3>Edytuj wydarzenie</h3>
        <form onSubmit={handleUpdateEvent}>
          <div className="form_group">
            <label htmlFor="edit_event_title">Tytuł:</label>
            <input
              id="edit_event_title"
              type="text"
              value={edit_event.title}
              onChange={(e) => setEditEvent({ ...edit_event, title: e.target.value })}
              required
            />
          </div>

          <div className="form_group">
            <label htmlFor="edit_event_description">Opis:</label>
            <textarea
              id="edit_event_description"
              value={edit_event.description || ''}
              onChange={(e) => setEditEvent({ ...edit_event, description: e.target.value })}
            />
          </div>

          <div className="form_row">
            <div className="form_group">
              <label htmlFor="edit_event_start">Początek:</label>
              <input
                id="edit_event_start"
                type="time"
                value={formatTime(edit_event.start_time)}
                onChange={(e) => setEditEvent({ ...edit_event, start_time: e.target.value })}
                required
              />
            </div>

            <div className="form_group">
              <label htmlFor="edit_event_end">Koniec:</label>
              <input
                id="edit_event_end"
                type="time"
                value={formatTime(edit_event.end_time)}
                onChange={(e) => setEditEvent({ ...edit_event, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form_actions">
            <button type="submit" className="btn_primary">Zapisz</button>
            <button
              type="button"
              className="btn_secondary"
              onClick={() => setEditEvent(null)}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { EditEvent };
