import { useCallback } from 'react';
import type { ScheduleSlot } from '../../../types';

interface EventFormProps {
  event: ScheduleSlot | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * Komponent formularza do dodawania i edycji wydarzeń w harmonogramie
 */
const EventForm = ({ event, onSubmit, onCancel }: EventFormProps) => {
  // Przekształcanie czasu ISO na format przyjazny dla pola input typu time
  const formatTimeForInput = useCallback((timeString?: string) => {
    if (!timeString) return '';

    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return '';

      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }, []);

  // Obsługa wysłania formularza
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    onSubmit(formData);
  }, [onSubmit]);

  return (
    <div className="event-form-overlay">
      <div className="event-form-container">
        <h3>{event ? 'Edytuj wydarzenie' : 'Dodaj nowe wydarzenie'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tytuł</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={event?.title || ''}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Opis</label>
            <textarea
              id="description"
              name="description"
              defaultValue={event?.description || ''}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Czas rozpoczęcia</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              defaultValue={formatTimeForInput(event?.start_time)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">Czas zakończenia</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              defaultValue={formatTimeForInput(event?.end_time)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {event ? 'Zapisz' : 'Dodaj'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 