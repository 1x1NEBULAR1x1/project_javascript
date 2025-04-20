const Pomodoro = require('../models/Pomodoro');

// Pobieranie ustawień pomodoro
exports.getSettings = (req, res) => {
  try {
    const settings = Pomodoro.getSettings();
    
    res.status(200).json({
      status: 'success',
      data: {
        settings
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania ustawień pomodoro',
      error: error.message
    });
  }
};

// Aktualizacja ustawień pomodoro
exports.updateSettings = (req, res) => {
  try {
    const { workDuration, breakDuration, longBreakDuration, longBreakInterval } = req.body;
    
    const settingsData = {
      work_duration: workDuration,
      break_duration: breakDuration,
      long_break_duration: longBreakDuration,
      long_break_interval: longBreakInterval
    };
    
    const settings = Pomodoro.updateSettings(settingsData);
    
    res.status(200).json({
      status: 'success',
      data: {
        settings
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas aktualizacji ustawień pomodoro',
      error: error.message
    });
  }
};

// Pobieranie sesji pomodoro dla określonej daty
exports.getSessionsByDate = (req, res) => {
  try {
    const { date } = req.params;
    const sessions = Pomodoro.getSessionsByDate(date);
    
    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: {
        sessions
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania sesji pomodoro',
      error: error.message
    });
  }
};

// Pobieranie wszystkich sesji pomodoro
exports.getAllSessions = (req, res) => {
  try {
    const sessions = Pomodoro.getAllSessions();
    
    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: {
        sessions
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania sesji pomodoro',
      error: error.message
    });
  }
};

// Zapisywanie nowej sesji pomodoro
exports.saveSession = (req, res) => {
  try {
    const { date, taskId, duration, type } = req.body;
    
    const sessionData = {
      task_id: taskId,
      start_time: date || new Date().toISOString(),
      duration,
      type
    };
    
    const session = Pomodoro.createSession(sessionData);
    
    res.status(201).json({
      status: 'success',
      data: {
        session
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas zapisywania sesji pomodoro',
      error: error.message
    });
  }
}; 