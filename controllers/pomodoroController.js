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
    const settingsData = req.body;

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
    const { task_id, date, duration, type, completed_sessions, total_time } = req.body;

    let sessionData = {};

    if (completed_sessions !== undefined || total_time !== undefined) {
      sessionData = {
        task_id: task_id || null,
        start_time: date || new Date().toISOString(),
        duration: total_time || 25,
        type: 'work'
      };
    } else {
      if (!duration || !type) {
        return res.status(400).json({
          status: 'error',
          message: 'Wymagane pola: duration, type'
        });
      }

      sessionData = {
        task_id: task_id !== undefined ? task_id : null,
        start_time: date || new Date().toISOString(),
        duration,
        type
      };
    }

    const session = Pomodoro.createSession(sessionData);

    if (!session) {
      return res.status(500).json({
        status: 'error',
        message: 'Nie można utworzyć sesji pomodoro'
      });
    }

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

// Aktualizacja sesji pomodoro
exports.updateSession = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    const session = Pomodoro.getSessionById(id);

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Sesja nie znaleziona'
      });
    }

    const updatedSession = Pomodoro.updateSession(id, updateData);

    if (!updatedSession) {
      return res.status(500).json({
        status: 'error',
        message: 'Nie można zaktualizować sesji'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        session: updatedSession
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas aktualizacji sesji',
      error: error.message
    });
  }
};

// Zakończenie sesji pomodoro
exports.completeSession = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { duration } = req.body;
    const session = Pomodoro.getSessionById(id);

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Sesja nie znaleziona'
      });
    }

    const updateData = {
      end_time: new Date().toISOString()
    };

    if (duration !== undefined) {
      updateData.duration = duration;
    }

    const updatedSession = Pomodoro.updateSession(id, updateData);

    if (!updatedSession) {
      return res.status(500).json({
        status: 'error',
        message: 'Nie można zaktualizować sesji'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        session: updatedSession
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas aktualizacji sesji',
      error: error.message
    });
  }
};

// Usuwanie sesji pomodoro
exports.deleteSession = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const session = Pomodoro.getSessionById(id);

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Sesja nie znaleziona'
      });
    }

    const deleted = Pomodoro.deleteSession(id);

    if (!deleted) {
      return res.status(500).json({
        status: 'error',
        message: 'Nie można usunąć sesji'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Sesja usunięta pomyślnie'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas usuwania sesji',
      error: error.message
    });
  }
}; 