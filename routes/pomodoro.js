const express = require('express');
const router = express.Router();
const Pomodoro = require('../models/Pomodoro');

/**
 * @swagger
 * components:
 *   schemas:
 *     PomodoroSettings:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID ustawień (zawsze 1)
 *         work_duration:
 *           type: integer
 *           description: Czas pracy w minutach
 *         break_duration:
 *           type: integer
 *           description: Czas przerwy w minutach
 *         long_break_duration:
 *           type: integer
 *           description: Czas długiej przerwy w minutach
 *         long_break_interval:
 *           type: integer
 *           description: Liczba sesji przed długą przerwą
 *     PomodoroSession:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID sesji
 *         task_id:
 *           type: integer
 *           description: ID powiązanego zadania
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: Czas rozpoczęcia sesji
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: Czas zakończenia sesji
 *         duration:
 *           type: integer
 *           description: Czas trwania sesji w minutach
 *         type:
 *           type: string
 *           description: Typ sesji (work, break, long_break)
 */

/**
 * @swagger
 * /api/pomodoro/settings:
 *   get:
 *     summary: Pobierz ustawienia pomodoro
 *     tags: [Pomodoro]
 *     responses:
 *       200:
 *         description: Ustawienia pomodoro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     settings:
 *                       $ref: '#/components/schemas/PomodoroSettings'
 */
router.get('/settings', (req, res) => {
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
});

/**
 * @swagger
 * /api/pomodoro/settings:
 *   put:
 *     summary: Aktualizuj ustawienia pomodoro
 *     tags: [Pomodoro]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workDuration:
 *                 type: integer
 *                 description: Czas pracy w minutach
 *               breakDuration:
 *                 type: integer
 *                 description: Czas przerwy w minutach
 *               longBreakDuration:
 *                 type: integer
 *                 description: Czas długiej przerwy w minutach
 *               longBreakInterval:
 *                 type: integer
 *                 description: Liczba sesji przed długą przerwą
 *     responses:
 *       200:
 *         description: Ustawienia zaktualizowane
 */
router.put('/settings', (req, res) => {
  try {
    const { workDuration, breakDuration, longBreakDuration, longBreakInterval } = req.body;

    const settingsData = {
      work_duration: workDuration,
      break_duration: breakDuration,
      long_break_duration: longBreakDuration,
      long_break_interval: longBreakInterval
    };

    const settings = Pomodoro.updateSettings(settingsData);

    if (!settings) {
      return res.status(500).json({
        status: 'error',
        message: 'Nie można zaktualizować ustawień pomodoro'
      });
    }

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
});

/**
 * @swagger
 * /api/pomodoro/sessions:
 *   get:
 *     summary: Pobierz wszystkie sesje pomodoro
 *     tags: [Pomodoro]
 *     responses:
 *       200:
 *         description: Lista wszystkich sesji pomodoro
 */
router.get('/sessions', (req, res) => {
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
});

/**
 * @swagger
 * /api/pomodoro/sessions/{date}:
 *   get:
 *     summary: Pobierz sesje pomodoro dla konkretnej daty
 *     tags: [Pomodoro]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data sesji (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Sesje pomodoro dla danej daty
 */
router.get('/sessions/:date', (req, res) => {
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
});

/**
 * @swagger
 * /api/pomodoro/sessions:
 *   post:
 *     summary: Utwórz nową sesję pomodoro
 *     tags: [Pomodoro]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *                 description: ID powiązanego zadania
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Czas rozpoczęcia sesji
 *               duration:
 *                 type: integer
 *                 description: Czas trwania sesji w minutach
 *               type:
 *                 type: string
 *                 description: Typ sesji (work, break, long_break)
 *               completedSessions:
 *                 type: integer
 *                 description: (Legacy) Liczba ukończonych sesji
 *               totalTime:
 *                 type: integer
 *                 description: (Legacy) Całkowity czas pracy w minutach
 *     responses:
 *       201:
 *         description: Sesja utworzona
 */
router.post('/sessions', (req, res) => {
  try {
    const { taskId, date, duration, type, completedSessions, totalTime } = req.body;

    let sessionData = {};

    if (completedSessions !== undefined || totalTime !== undefined) {
      sessionData = {
        task_id: taskId || null,
        start_time: date || new Date().toISOString(),
        duration: totalTime || 25,
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
        task_id: taskId !== undefined ? taskId : null,
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
      message: 'Błąd podczas tworzenia sesji pomodoro',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/pomodoro/sessions/{id}/complete:
 *   put:
 *     summary: Zakończ sesję pomodoro
 *     tags: [Pomodoro]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sesji
 *     responses:
 *       200:
 *         description: Sesja zakończona
 */
router.put('/sessions/:id/complete', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const session = Pomodoro.getSessionById(id);

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Sesja nie znaleziona'
      });
    }

    const updatedSession = Pomodoro.completeSession(id, new Date().toISOString());

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
});

/**
 * @swagger
 * /api/pomodoro/sessions/{id}:
 *   delete:
 *     summary: Usuń sesję pomodoro
 *     tags: [Pomodoro]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sesji
 *     responses:
 *       200:
 *         description: Sesja usunięta
 */
router.delete('/sessions/:id', (req, res) => {
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
});

module.exports = router; 