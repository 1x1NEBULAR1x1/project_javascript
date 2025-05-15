import { memo } from 'react';
import type { ScheduleSlot } from '../../../types';

interface EventItemProps {
  event: ScheduleSlot;
  onEdit: (event: ScheduleSlot) => void;
  onDelete: (event: ScheduleSlot) => void;
}

/**
 * Komponent wyświetlający pojedyncze wydarzenie w harmonogramie
 */
const EventItem = ({ event, onEdit, onDelete }: EventItemProps) => {
  // Formatowanie czasu z formatu ISO na czytelny format godziny
  const formatTime = (timeString: string) => {
    try {
      if (!timeString) return 'Brak czasu';

      const fullDate = timeString.includes('T') ? timeString : `2000-01-01T${timeString}`;
      const time = new Date(fullDate);

      if (isNaN(time.getTime())) {
        return timeString;
      }

      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Nieprawidłowy czas';
    }
  };

  return (
    <div className="event-item">
      <div className="event-time">
        {formatTime(event.start_time)} - {formatTime(event.end_time)}
      </div>
      <div className="event-details">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
      </div>
      <div className="event-actions">
        <button
          className="edit-button"
          onClick={() => onEdit(event)}
        >
          Edytuj
        </button>
        <button
          className="delete-button"
          onClick={() => onDelete(event)}
        >
          Usuń
        </button>
      </div>
    </div>
  );
};

// Używamy memo dla optymalizacji rerenderów
export default memo(EventItem); 