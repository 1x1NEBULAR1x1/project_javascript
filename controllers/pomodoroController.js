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
    const settings = Pomodoro.updateSettings(req.body);
    
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
    const session = Pomodoro.saveSession(req.body);
    
    res.status(session.id ? 201 : 200).json({
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