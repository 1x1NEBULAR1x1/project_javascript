import type { FC } from 'react';
import type { Schedule } from '../hooks/scheduleApi';
import { EventCard } from './EventCard';

interface EventsListProps {
  schedule: Schedule;
  is_loading: boolean;
  formatTime: (time_string: string) => string;
}

const EventsList: FC<EventsListProps> = ({ schedule, is_loading, formatTime }) => {

  return is_loading ? (
    <div className="loading">Ładowanie harmonogramu...</div>
  ) : (
    <div className="events_list">
      <h3>Wydarzenia</h3>
      {schedule.events && schedule.events.length > 0 ? (
        <div className="events_timeline">
          {schedule.events
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
            .map(event => (
              <EventCard key={event.id} event={event} formatTime={formatTime} schedule_id={schedule.id} />
            ))}
        </div>) : (
        <p className="no_events">Brak wydarzeń na ten dzień</p>
      )}
    </div>
  );
};

export { EventsList };
