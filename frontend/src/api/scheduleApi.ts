import type { Schedule, ScheduleEvent } from '../types';
import { api } from './baseApi';

/**
 * Przekształca dane wydarzenia z formatu backendowego na format frontendowy
 */
const adaptEventFromBackend = (data: any): ScheduleEvent => {
  if (!data) return {
    id: 0,
    schedule_id: 0,
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    created_at: '',
    updated_at: ''
  };

  return {
    id: data.id,
    schedule_id: data.schedule_id,
    title: data.title || '',
    description: data.description || '',
    start_time: data.start_time || data.startTime || '',
    end_time: data.end_time || data.endTime || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || ''
  };
};

/**
 * Przekształca dane harmonogramu z formatu backendowego na format frontendowy
 */
const adaptScheduleFromBackend = (data: any): Schedule | null => {
  if (!data) return null;
  const scheduleData = data.schedule || data;
  if (scheduleData.slots && Array.isArray(scheduleData.slots)) {
    return {
      ...scheduleData,
      id: Number(scheduleData.id) || 0
    };
  }

  const slots = Array.isArray(scheduleData.events)
    ? scheduleData.events.map(adaptEventFromBackend)
    : [];

  return {
    id: Number(scheduleData.id) || 0,
    title: scheduleData.title || '',
    description: scheduleData.description || '',
    date: scheduleData.date || '',
    start_date: scheduleData.start_date || '',
    end_date: scheduleData.end_date || '',
    created_at: scheduleData.created_at || '',
    updated_at: scheduleData.updated_at || '',
    slots
  };
};

const getScheduleIdCacheKey = (date: string) => `schedule_id_${date}`;

/**
 * Zapisuje ID harmonogramu dla konkretnej daty w pamięci sesji
 */
const saveScheduleIdForDate = (date: string, id: number): void => {
  if (id <= 0) return;
  sessionStorage.setItem(getScheduleIdCacheKey(date), id.toString());
};

/**
 * Pobiera zapisane ID harmonogramu dla daty z pamięci sesji
 */
const getScheduleIdForDate = (date: string): number => {
  const savedId = sessionStorage.getItem(getScheduleIdCacheKey(date));
  return savedId ? parseInt(savedId, 10) : 0;
};

/**
 * Pobiera wszystkie harmonogramy
 */
export const fetchSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await api.get('/schedule');
    const schedules = response.data.data?.schedules || [];
    return schedules.map(adaptScheduleFromBackend).filter(Boolean) as Schedule[];
  } catch (error) {
    throw error;
  }
};

/**
 * Pobiera harmonogram dla konkretnej daty
 */
export const fetchScheduleByDate = async (date: string): Promise<Schedule | null> => {
  try {
    const saved_id = getScheduleIdForDate(date);

    if (saved_id > 0) {
      try {
        const schedule_by_id = await fetchScheduleById(saved_id);
        if (schedule_by_id &&
          schedule_by_id.id > 0 &&
          (schedule_by_id.date === date ||
            (schedule_by_id.start_date && schedule_by_id.start_date.startsWith(date)) ||
            (schedule_by_id.end_date && schedule_by_id.end_date.startsWith(date)))) {
          return schedule_by_id;
        }
      } catch (error) {
      }
    }

    const response = await api.get(`/schedule/${date}`);

    if (response.data.status === 'success' &&
      response.data.data?.schedule &&
      response.data.data.schedule.id > 0) {
      saveScheduleIdForDate(date, response.data.data.schedule.id);

      if (response.data.data.schedule.events &&
        Array.isArray(response.data.data.schedule.events) &&
        response.data.data.schedule.events.length > 0) {
        return adaptScheduleFromBackend(response.data.data?.schedule);
      }
    }

    if (response.data.status === 'success' &&
      response.data.data?.schedule &&
      response.data.data.schedule.id === 0) {

      if (saved_id > 0) {
        const schedule_by_id = await fetchScheduleById(saved_id);
        if (schedule_by_id && schedule_by_id.id > 0) {
          return schedule_by_id;
        }
      }

      return {
        id: 0,
        title: `Harmonogram na ${date}`,
        description: '',
        date,
        start_date: `${date}T00:00:00`,
        end_date: `${date}T23:59:59`,
        created_at: '',
        updated_at: '',
        slots: []
      };
    }

    return adaptScheduleFromBackend(response.data.data?.schedule);
  } catch (error) {
    throw error;
  }
};

/**
 * Pobiera harmonogram według identyfikatora
 */
export const fetchScheduleById = async (id: number): Promise<Schedule | null> => {
  try {
    // Nie pobieramy harmonogramu z id=0, ponieważ jeszcze nie istnieje
    if (id === 0) {
      return null;
    }

    const response = await api.get(`/schedule/id/${id}`);

    // Jeśli udało się pobrać harmonogram, zapisujemy jego ID dla daty
    if (response.data.status === 'success' &&
      response.data.data?.schedule &&
      response.data.data.schedule.date) {
      saveScheduleIdForDate(response.data.data.schedule.date, id);
    }

    return adaptScheduleFromBackend(response.data.data?.schedule);
  } catch (error) {
    throw error;
  }
};

/**
 * Tworzy nowy harmonogram
 */
export const createSchedule = async (scheduleData: Partial<Schedule>): Promise<Schedule> => {
  try {
    const response = await api.post('/schedule', scheduleData);

    const scheduleFromData = response.data.data?.schedule;
    // Obsługa specjalnego przypadku gdy serwer nie zwraca pełnego obiektu
    if (!scheduleFromData && response.data.status === 'success') {
      if (response.data.id || (response.data.data && response.data.data.id)) {
        const id = response.data.id || response.data.data.id;

        // Zapisujemy ID dla daty
        if (scheduleData.date) {
          saveScheduleIdForDate(scheduleData.date, Number(id));
        }

        return {
          id: Number(id),
          title: scheduleData.title || '',
          description: scheduleData.description || '',
          date: scheduleData.date || '',
          start_date: scheduleData.start_date || '',
          end_date: scheduleData.end_date || '',
          created_at: '',
          updated_at: '',
          slots: []
        };
      }
    }

    if (!scheduleFromData) {
      throw new Error('Nie udało się utworzyć harmonogramu');
    }

    // Zapisujemy ID dla daty
    if (scheduleFromData.date) {
      saveScheduleIdForDate(scheduleFromData.date, Number(scheduleFromData.id));
    }

    return adaptScheduleFromBackend(scheduleFromData) as Schedule;
  } catch (error) {
    throw error;
  }
};

/**
 * Aktualizuje istniejący harmonogram
 */
export const updateSchedule = async (id: number, scheduleData: Partial<Schedule>): Promise<Schedule> => {
  try {
    const response = await api.put(`/schedule/${id}`, scheduleData);

    const updatedSchedule = response.data.data?.schedule;
    if (!updatedSchedule) {
      throw new Error(`Nie udało się zaktualizować harmonogramu`);
    }

    // Zapisujemy ID dla daty
    if (updatedSchedule.date) {
      saveScheduleIdForDate(updatedSchedule.date, Number(updatedSchedule.id));
    }

    return adaptScheduleFromBackend(updatedSchedule) as Schedule;
  } catch (error) {
    throw error;
  }
};

/**
 * Usuwa harmonogram
 */
export const deleteSchedule = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/schedule/${id}`);
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Dodaje wydarzenie do harmonogramu
 */
export const addScheduleEvent = async (schedule_id: number, eventData: Partial<ScheduleEvent>): Promise<ScheduleEvent> => {
  try {
    if (!schedule_id || schedule_id <= 0) {
      throw new Error(`Nieprawidłowy identyfikator harmonogramu`);
    }

    // Przekształcenie danych do formatu wymaganego przez API
    const adaptedData = {
      title: eventData.title,
      description: eventData.description,
      startTime: eventData.start_time,
      endTime: eventData.end_time
    };

    const response = await api.post(`/schedule/${schedule_id}/events`, adaptedData);

    const eventFromData = response.data.data?.event;
    if (!eventFromData) {
      throw new Error('Nie udało się dodać wydarzenia');
    }

    return adaptEventFromBackend(eventFromData);
  } catch (error) {
    throw error;
  }
};

/**
 * Aktualizuje wydarzenie w harmonogramie
 */
export const updateScheduleEvent = async (
  schedule_id: number,
  event_id: number,
  eventData: Partial<ScheduleEvent>
): Promise<ScheduleEvent> => {
  try {
    // Przekształcenie danych do formatu wymaganego przez API
    const adaptedData = {
      title: eventData.title,
      description: eventData.description,
      startTime: eventData.start_time,
      endTime: eventData.end_time
    };

    const response = await api.put(`/schedule/${schedule_id}/events/${event_id}`, adaptedData);

    const updatedEvent = response.data.data?.event;
    if (!updatedEvent) {
      throw new Error(`Nie udało się zaktualizować wydarzenia`);
    }
    return adaptEventFromBackend(updatedEvent);
  } catch (error) {
    throw error;
  }
};

/**
 * Usuwa wydarzenie z harmonogramu
 */
export const deleteScheduleEvent = async (schedule_id: number, event_id: number): Promise<boolean> => {
  try {
    await api.delete(`/schedule/${schedule_id}/events/${event_id}`);
    return true;
  } catch (error) {
    throw error;
  }
};