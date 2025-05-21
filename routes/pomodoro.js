const express = require('express');
const router = express.Router();
const pomodoroController = require('../controllers/pomodoroController');

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
router.get('/settings', pomodoroController.getSettings);

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
router.put('/settings', pomodoroController.updateSettings);

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
router.get('/sessions', pomodoroController.getAllSessions);

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
router.get('/sessions/:date', pomodoroController.getSessionsByDate);

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
router.post('/sessions', pomodoroController.saveSession);

/**
 * @swagger
 * /api/pomodoro/sessions/{id}:
 *   put:
 *     summary: Aktualizuj sesję pomodoro
 *     tags: [Pomodoro]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sesji
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *                 description: ID powiązanego zadania
 *               duration:
 *                 type: integer
 *                 description: Czas trwania sesji w sekundach
 *               type:
 *                 type: string
 *                 description: Typ sesji (work, break, long_break)
 *     responses:
 *       200:
 *         description: Sesja zaktualizowana
 */
router.put('/sessions/:id', pomodoroController.updateSession);

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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: integer
 *                 description: Rzeczywisty czas trwania sesji w sekundach
 *     responses:
 *       200:
 *         description: Sesja zakończona
 */
router.put('/sessions/:id/complete', pomodoroController.completeSession);

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
router.delete('/sessions/:id', pomodoroController.deleteSession);

module.exports = router; 