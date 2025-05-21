import type { FC } from 'react';
import type { ScheduleEvent } from '../hooks/scheduleApi';
import { useEvent } from '../hooks/useEvent';
import { useScheduleStore } from '../hooks/useScheduleStore';

interface EventCardProps {
  event: ScheduleEvent;
  formatTime: (time: string) => string;
  schedule_id: number;
}

const EventCard: FC<EventCardProps> = ({ event, formatTime, schedule_id }) => {
  const { setEditEvent } = useScheduleStore(state => state);
  const { deleteEvent } = useEvent();

  const handleDeleteEvent = (event_id: number) => {
    if (!schedule_id) return;
    deleteEvent({ schedule_id, event_id });
  };

  return (
    <div key={event.id} className="event_card">
      <div className="event_time">
        <span>{formatTime(event.start_time)}</span>
        <span> - </span>
        <span>{formatTime(event.end_time)}</span>
      </div>
      <div className="event_content">
        <h4>{event.title}</h4>
        <p>{event.description}</p>
      </div>
      <div className="event_actions">
        <button
          onClick={() => setEditEvent(event)}
          className="btn_edit"
        >
          Edytuj
        </button>
        <button
          onClick={() => handleDeleteEvent(event.id)}
          className="btn_delete"
        >
          Usuń
        </button>
      </div>
    </div>
  );
};

export { EventCard };
