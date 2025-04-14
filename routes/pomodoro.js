const express = require('express');
const router = express.Router();
const pomodoroController = require('../controllers/pomodoroController');

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
 *       500:
 *         description: Błąd serwera
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
 *                 example: 25
 *               breakDuration:
 *                 type: integer
 *                 description: Czas przerwy w minutach
 *                 example: 5
 *               longBreakDuration:
 *                 type: integer
 *                 description: Czas długiej przerwy w minutach
 *                 example: 15
 *               longBreakInterval:
 *                 type: integer
 *                 description: Liczba sesji przed długą przerwą
 *                 example: 4
 *     responses:
 *       200:
 *         description: Ustawienia zaktualizowane
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
 *       500:
 *         description: Błąd serwera
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PomodoroSession'
 *       500:
 *         description: Błąd serwera
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PomodoroSession'
 *       500:
 *         description: Błąd serwera
 */
router.get('/sessions/:date', pomodoroController.getSessionsByDate);

/**
 * @swagger
 * /api/pomodoro/sessions:
 *   post:
 *     summary: Zapisz nową sesję pomodoro
 *     tags: [Pomodoro]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - completedSessions
 *               - totalTime
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data sesji (YYYY-MM-DD)
 *                 example: "2025-04-11"
 *               completedSessions:
 *                 type: integer
 *                 description: Liczba ukończonych sesji
 *                 example: 1
 *               totalTime:
 *                 type: integer
 *                 description: Całkowity czas pracy w minutach
 *                 example: 25
 *     responses:
 *       201:
 *         description: Sesja utworzona
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
 *                     session:
 *                       $ref: '#/components/schemas/PomodoroSession'
 *       200:
 *         description: Sesja zaktualizowana (gdy istnieje już sesja z tą datą)
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
 *                     session:
 *                       $ref: '#/components/schemas/PomodoroSession'
 *       500:
 *         description: Błąd serwera
 */
router.post('/sessions', pomodoroController.saveSession);

module.exports = router; 