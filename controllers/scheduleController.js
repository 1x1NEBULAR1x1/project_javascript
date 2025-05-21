const Schedule = require('../models/Schedule');

// Get schedule by date
exports.getScheduleByDate = (req, res) => {
  try {
    const { date } = req.params;

    const daySchedule = Schedule.getByDate(date);

    if (!daySchedule) {
      const existingSchedules = Schedule.getAll();

      const exactDateMatch = existingSchedules.find(s => s.date === date);

      if (exactDateMatch) {
        const fullSchedule = Schedule.getById(exactDateMatch.id);
        if (fullSchedule) {
          return res.status(200).json({
            status: 'success',
            data: {
              schedule: fullSchedule
            }
          });
        }
      }

      const matchingSchedule = existingSchedules.find(s =>
        (s.start_date && s.start_date.startsWith(date)) ||
        (s.end_date && s.end_date.startsWith(date))
      );

      if (matchingSchedule) {
        const fullSchedule = Schedule.getById(matchingSchedule.id);
        if (fullSchedule) {
          return res.status(200).json({
            status: 'success',
            data: {
              schedule: fullSchedule
            }
          });
        }
      }

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
    console.error('Błąd podczas pobierania harmonogramu:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania harmonogramu',
      error: error.message
    });
  }
};

exports.getScheduleById = (req, res) => {
  try {
    const { id } = req.params;

    const schedule_id = parseInt(id, 10);

    if (isNaN(schedule_id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Nieprawidłowy format ID harmonogramu'
      });
    }

    const schedule = Schedule.getById(schedule_id);

    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Nie znaleziono harmonogramu o podanym ID'
      });
    }

    const adaptedSchedule = {
      ...schedule,
      events: schedule.events?.map(event => ({
        ...event,
        start_time: event.startTime,
        end_time: event.endTime
      })) || []
    };

    res.status(200).json({
      status: 'success',
      data: {
        schedule: adaptedSchedule
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania harmonogramu:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania harmonogramu',
      error: error.message
    });
  }
};

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
    console.error('Błąd podczas pobierania harmonogramów:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania harmonogramów',
      error: error.message
    });
  }
};

exports.createSchedule = (req, res) => {
  try {
    const { date, events, title, description, start_date, end_date } = req.body;

    if (date) {
      const existingSchedule = Schedule.getByDate(date);
      if (existingSchedule && existingSchedule.id > 0) {
        return res.status(200).json({
          status: 'success',
          message: 'Harmonogram już istnieje',
          data: {
            schedule: existingSchedule
          }
        });
      }
    }

    let scheduleData = {};

    if (date) {
      const firstEventTitle = events && events.length > 0 ? events[0].title : 'Wydarzenie';
      const firstEventDesc = events && events.length > 0 ? events[0].description : '';
      const start_time = events && events.length > 0 ? events[0].start_time : '00:00';
      const end_time = events && events.length > 0 ? events[0].end_time : '23:59';

      scheduleData = {
        title: title || firstEventTitle,
        description: description || firstEventDesc,
        start_date: start_date || `${date}T${start_time}`,
        end_date: end_date || `${date}T${end_time}`,
        date: date
      };
    } else {
      // Wyodrębniamy datę z start_date jeśli została podana
      let extractedDate = '';
      if (start_date && start_date.includes('T')) {
        extractedDate = start_date.split('T')[0];
      }

      scheduleData = {
        title,
        description,
        start_date,
        end_date,
        date: extractedDate
      };
    }

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

exports.addEvent = (req, res) => {
  try {
    const { schedule_id } = req.params;
    const newEvent = Schedule.addEvent(schedule_id, req.body);

    if (!newEvent) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nie znaleziono harmonogramu o podanym ID'
      });
    }

    const responseEvent = {
      ...newEvent,
      start_time: newEvent.startTime,
      end_time: newEvent.endTime
    };

    res.status(201).json({
      status: 'success',
      data: {
        event: responseEvent
      }
    });
  } catch (error) {
    console.error('Błąd podczas dodawania wydarzenia:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas dodawania wydarzenia',
      error: error.message
    });
  }
};

exports.updateEvent = (req, res) => {
  try {
    const { schedule_id, event_id } = req.params;

    const eventData = {
      title: req.body.title,
      description: req.body.description,
      startTime: req.body.start_time,
      endTime: req.body.end_time
    };

    const updatedEvent = Schedule.updateEvent(schedule_id, event_id, eventData);

    if (!updatedEvent) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nie znaleziono harmonogramu lub wydarzenia o podanym ID'
      });
    }

    const responseEvent = {
      ...updatedEvent,
      start_time: updatedEvent.startTime,
      end_time: updatedEvent.endTime
    };

    res.status(200).json({
      status: 'success',
      data: {
        event: responseEvent
      }
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji wydarzenia:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas aktualizacji wydarzenia',
      error: error.message
    });
  }
};

exports.deleteEvent = (req, res) => {
  try {
    const { schedule_id, event_id } = req.params;
    const result = Schedule.deleteEvent(schedule_id, event_id);

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
    console.error('Błąd podczas usuwania wydarzenia:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas usuwania wydarzenia',
      error: error.message
    });
  }
}; 