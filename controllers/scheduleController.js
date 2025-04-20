const Schedule = require('../models/Schedule');

// Pobieranie harmonogramu dla określonej daty
exports.getScheduleByDate = (req, res) => {
  try {
    const { date } = req.params;
    const daySchedule = Schedule.getByDate(date);
    
    if (!daySchedule) {
      return res.status(200).json({
        status: 'success',
        data: {
          schedule: {
            id: 0,
            date,
            events: []
          }
        }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        schedule: daySchedule
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania harmonogramu',
      error: error.message
    });
  }
};

// Pobieranie wszystkich harmonogramów
exports.getAllSchedules = (req, res) => {
  try {
    const schedules = Schedule.getAll();
    res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: {
        schedules
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania harmonogramów',
      error: error.message
    });
  }
};

// Tworzenie nowego harmonogramu dla dnia
exports.createSchedule = (req, res) => {
  try {
    // Sprawdzenie czy mamy stary format (z datą i wydarzeniami)
    const { date, events, title, description, start_date, end_date } = req.body;
    
    let scheduleData = {};
    
    if (date) {
      // Stary format
      const firstEventTitle = events && events.length > 0 ? events[0].title : 'Wydarzenie';
      const firstEventDesc = events && events.length > 0 ? events[0].description : '';
      const startTime = events && events.length > 0 ? events[0].startTime : '00:00';
      const endTime = events && events.length > 0 ? events[0].endTime : '23:59';
      
      // Konwersja do nowego formatu
      scheduleData = {
        title: firstEventTitle,
        description: firstEventDesc,
        start_date: `${date}T${startTime}`,
        end_date: `${date}T${endTime}`
      };
    } else {
      // Nowy format
      scheduleData = { title, description, start_date, end_date };
    }
    
    // Sprawdzenie wymaganych pól
    if (!scheduleData.title || !scheduleData.start_date || !scheduleData.end_date) {
      return res.status(400).json({
        status: 'fail',
        message: 'Wymagane pola: title, start_date, end_date'
      });
    }
    
    const newSchedule = Schedule.create(scheduleData);
    
    if (!newSchedule) {
      return res.status(400).json({
        status: 'fail',
        message: 'Nie udało się utworzyć harmonogramu'
      });
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        schedule: newSchedule
      }
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia harmonogramu:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas tworzenia harmonogramu',
      error: error.message
    });
  }
};

// Dodawanie wydarzenia do harmonogramu
exports.addEvent = (req, res) => {
  try {
    const { scheduleId } = req.params;
    const newEvent = Schedule.addEvent(scheduleId, req.body);
    
    if (!newEvent) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nie znaleziono harmonogramu o podanym ID'
      });
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        event: newEvent
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas dodawania wydarzenia',
      error: error.message
    });
  }
};

// Aktualizacja wydarzenia w harmonogramie
exports.updateEvent = (req, res) => {
  try {
    const { scheduleId, eventId } = req.params;
    const updatedEvent = Schedule.updateEvent(scheduleId, eventId, req.body);
    
    if (!updatedEvent) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nie znaleziono harmonogramu lub wydarzenia o podanym ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        event: updatedEvent
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas aktualizacji wydarzenia',
      error: error.message
    });
  }
};

// Usuwanie wydarzenia z harmonogramu
exports.deleteEvent = (req, res) => {
  try {
    const { scheduleId, eventId } = req.params;
    const result = Schedule.deleteEvent(scheduleId, eventId);
    
    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nie znaleziono harmonogramu lub wydarzenia o podanym ID'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas usuwania wydarzenia',
      error: error.message
    });
  }
}; 