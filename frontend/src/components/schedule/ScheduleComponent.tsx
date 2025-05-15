import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ScheduleSlot } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { useSchedule } from './hooks/useSchedule';
import ScheduleHeader from './components/ScheduleHeader';
import EventsList from './components/EventsList';
import EventForm from './components/EventForm';

/**
 * Główny komponent harmonogramu zarządzający wyświetlaniem i modyfikacją wydarzeń
 */
const ScheduleComponent = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleSlot | null>(null);
  const [createdScheduleId, setCreatedScheduleId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  // Flaga zapobiegająca zbędnym odświeżeniom po dodaniu wydarzenia
  const [preventRefresh, setPreventRefresh] = useState<boolean>(false);

  const { showSuccess, showError } = useNotification();

  const {
    schedule,
    isLoading,
    createScheduleAsync,
    addEvent,
    updateEvent,
    deleteEvent,
    refetchSchedule,
    refreshScheduleById
  } = useSchedule({
    selectedDate,
    onSuccess: showSuccess,
    onError: showError
  });

  // Efekt do odświeżania harmonogramu po utworzeniu
  useEffect(() => {
    if (createdScheduleId && createdScheduleId > 0 && !preventRefresh) {
      refreshScheduleById(createdScheduleId);
    }
  }, [createdScheduleId, refreshScheduleById, preventRefresh]);

  // Pobieramy dane przy zmianie daty
  useEffect(() => {
    if (!preventRefresh) {
      refetchSchedule();
    }
  }, [selectedDate, refetchSchedule, preventRefresh]);

  // Aktualizacja createdScheduleId po pobraniu harmonogramu
  useEffect(() => {
    if (schedule && schedule.id > 0 && !createdScheduleId) {
      setCreatedScheduleId(schedule.id);
    }
  }, [schedule, createdScheduleId]);

  // Tworzymy nowy harmonogram, gdy jest pusty lub ma id=0
  const createNewSchedule = useCallback(async () => {
    try {
      // Jeśli mamy już zapisany ID, używamy go
      if (createdScheduleId && createdScheduleId > 0) {
        // Próbujemy odświeżyć po ID
        await refreshScheduleById(createdScheduleId);

        // Jeżeli schedule jest dostępny po odświeżeniu, zwracamy go
        if (schedule && schedule.id > 0) {
          return schedule;
        }
      }

      // Jeśli harmonogram ma id=0 lub nie istnieje, tworzymy nowy
      const needsNewSchedule = !schedule || schedule.id === 0;

      if (needsNewSchedule) {
        const newScheduleData = {
          title: `Harmonogram na ${selectedDate}`,
          description: 'Automatycznie utworzony harmonogram',
          date: selectedDate,
          start_date: `${selectedDate}T00:00:00`,
          end_date: `${selectedDate}T23:59:59`
        };

        // Blokujemy odświeżanie podczas tworzenia
        setPreventRefresh(true);

        const result = await createScheduleAsync(newScheduleData);

        if (result && result.id > 0) {
          setCreatedScheduleId(result.id);

          // Odblokujemy odświeżanie po krótkim opóźnieniu
          setTimeout(() => {
            setPreventRefresh(false);
          }, 1000);

          return result;
        }
      } else {
        // Zwracamy istniejący harmonogram
        return schedule;
      }
      return null;
    } catch (error) {
      setPreventRefresh(false);
      showError('Nie udało się utworzyć harmonogramu');
      return null;
    }
  }, [schedule, createdScheduleId, selectedDate, createScheduleAsync, refreshScheduleById, showError]);

  const handleAddEvent = async () => {
    try {
      await createNewSchedule();
      setShowEventForm(true);
      setEditingEvent(null);
    } catch (error) {
      showError('Nie udało się utworzyć harmonogramu');
    }
  };

  const handleEditEvent = (event: ScheduleSlot) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (event: ScheduleSlot) => {
    if (window.confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
      setPreventRefresh(true);

      deleteEvent({
        schedule_id: event.schedule_id,
        eventId: event.id
      });

      // Odblokujemy odświeżanie po krótkim opóźnieniu
      setTimeout(() => {
        setPreventRefresh(false);
        // Odświeżamy dane po usunięciu
        if (event.schedule_id > 0) {
          refreshScheduleById(event.schedule_id);
        }
      }, 1000);
    }
  };

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);

      if (schedule && schedule.id > 0) {
        await refreshScheduleById(schedule.id);
        showSuccess('Dane odświeżone');
      } else if (createdScheduleId && createdScheduleId > 0) {
        await refreshScheduleById(createdScheduleId);
        showSuccess('Dane odświeżone');
      } else {
        await refetchSchedule();
        showSuccess('Dane odświeżone');
      }
    } catch (error) {
      showError('Nie udało się odświeżyć danych');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEventSubmit = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    let startTime = formData.get('startTime') as string;
    let endTime = formData.get('endTime') as string;

    if (!title || !startTime || !endTime) {
      showError('Wszystkie wymagane pola muszą być wypełnione');
      return;
    }

    if (startTime && !startTime.includes(':')) {
      startTime = `${startTime}:00`;
    }
    if (endTime && !endTime.includes(':')) {
      endTime = `${endTime}:00`;
    }

    const eventData = {
      title,
      description,
      start_time: startTime.includes('T') ? startTime : `${selectedDate}T${startTime}`,
      end_time: endTime.includes('T') ? endTime : `${selectedDate}T${endTime}`
    };

    try {
      // Blokujemy automatyczne odświeżanie przed operacjami
      setPreventRefresh(true);

      if (editingEvent) {
        // Aktualizacja istniejącego wydarzenia
        await updateEvent({
          schedule_id: editingEvent.schedule_id,
          eventId: editingEvent.id,
          eventData
        });

        // Odświeżamy dane po aktualizacji
        setTimeout(() => {
          if (editingEvent.schedule_id > 0) {
            refreshScheduleById(editingEvent.schedule_id);
            // Po odświeżeniu możemy znowu pozwolić na automatyczne odświeżanie
            setTimeout(() => {
              setPreventRefresh(false);
            }, 500);
          } else {
            setPreventRefresh(false);
          }
        }, 500);
      } else {
        // Dodawanie nowego wydarzenia - najpierw sprawdzamy czy harmonogram istnieje
        const activeSchedule = await createNewSchedule();

        if (!activeSchedule || activeSchedule.id <= 0) {
          throw new Error('Nie udało się utworzyć lub pobrać harmonogramu');
        }

        await addEvent({
          schedule_id: activeSchedule.id,
          eventData
        });

        // Odświeżamy dane po dodaniu wydarzenia, ale tylko po ID
        setTimeout(() => {
          if (activeSchedule.id > 0) {
            refreshScheduleById(activeSchedule.id);
            // Po odświeżeniu możemy znowu pozwolić na automatyczne odświeżanie
            setTimeout(() => {
              setPreventRefresh(false);
            }, 500);
          } else {
            setPreventRefresh(false);
          }
        }, 500);
      }

      setShowEventForm(false);
      setEditingEvent(null);
    } catch (error) {
      setPreventRefresh(false);
      showError('Wystąpił błąd podczas zapisywania wydarzenia');
    }
  };

  const handleCancelForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  // Przygotowujemy listę wydarzeń, obsługując przypadek gdy schedule jest nullem
  const eventsList = useMemo(() =>
    schedule?.slots && schedule.slots.length > 0 ? schedule.slots : [],
    [schedule]
  );

  const handleDateChange = useCallback((date: string) => {
    // Reset stanu przy zmianie daty
    setCreatedScheduleId(null);
    setPreventRefresh(false);
    setSelectedDate(date);
  }, []);

  return (
    <div className="schedule-component">
      <ScheduleHeader
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onRefresh={handleRefreshData}
        isRefreshing={isLoading || isRefreshing}
      />

      <motion.button
        className="add-event-button"
        onClick={handleAddEvent}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Dodaj wydarzenie
      </motion.button>

      <EventsList
        events={eventsList}
        isLoading={isLoading || isRefreshing}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSubmit={handleEventSubmit}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default ScheduleComponent;