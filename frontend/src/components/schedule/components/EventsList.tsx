import { memo } from 'react';
import type { ScheduleSlot } from '../../../types';
import EventItem from './EventItem';

interface EventsListProps {
  events: ScheduleSlot[];
  isLoading: boolean;
  onEdit: (event: ScheduleSlot) => void;
  onDelete: (event: ScheduleSlot) => void;
}

/**
 * Komponent wyświetlający listę wydarzeń w harmonogramie
 */
const EventsList = ({ events, isLoading, onEdit, onDelete }: EventsListProps) => {
  // Sprawdzamy, czy lista zawiera wydarzenia
  const hasEvents = events.length > 0;

  // Wyświetlamy spinner podczas ładowania
  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Ładowanie harmonogramu...</div>
      </div>
    );
  }

  return (
    <div className="events-list">
      {hasEvents ? (
        events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="empty-schedule">
          Brak wydarzeń na wybrany dzień. Dodaj nowe wydarzenie.
        </div>
      )}
    </div>
  );
};

// Używamy memo dla optymalizacji rerenderów
export default memo(EventsList); 