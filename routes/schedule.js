const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

/**
 * @swagger
 * /api/schedule:
 *   get:
 *     summary: Pobierz wszystkie harmonogramy
 *     tags: [Harmonogram]
 *     responses:
 *       200:
 *         description: Lista wszystkich harmonogramów
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
 *                     schedules:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Błąd serwera
 */
router.get('/', scheduleController.getAllSchedules);

/**
 * @swagger
 * /api/schedule/id/{id}:
 *   get:
 *     summary: Pobierz harmonogram po ID
 *     tags: [Harmonogram]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID harmonogramu
 *     responses:
 *       200:
 *         description: Harmonogram o podanym ID
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
 *                     schedule:
 *                       $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Harmonogram nie znaleziony
 *       500:
 *         description: Błąd serwera
 */
router.get('/id/:id', scheduleController.getScheduleById);

/**
 * @swagger
 * /api/schedule/{date}:
 *   get:
 *     summary: Pobierz harmonogram dla konkretnej daty
 *     tags: [Harmonogram]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data harmonogramu (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Harmonogram dla danej daty
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
 *                     schedule:
 *                       $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Błąd serwera
 */
router.get('/:date', scheduleController.getScheduleByDate);

/**
 * @swagger
 * /api/schedule:
 *   post:
 *     summary: Utwórz nowy harmonogram
 *     tags: [Harmonogram]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data harmonogramu (YYYY-MM-DD)
 *               events:
 *                 type: array
 *                 description: Lista wydarzeń (opcjonalna)
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     description:
 *                       type: string
 *     responses:
 *       201:
 *         description: Harmonogram utworzony
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
 *                     schedule:
 *                       $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Harmonogram dla tej daty już istnieje
 *       500:
 *         description: Błąd serwera
 */
router.post('/', scheduleController.createSchedule);

/**
 * @swagger
 * /api/schedule/{scheduleId}/events:
 *   post:
 *     summary: Dodaj nowe wydarzenie do harmonogramu
 *     tags: [Harmonogram]
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID harmonogramu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startTime
 *               - endTime
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tytuł wydarzenia
 *               startTime:
 *                 type: string
 *                 description: Czas rozpoczęcia (HH:MM)
 *               endTime:
 *                 type: string
 *                 description: Czas zakończenia (HH:MM)
 *               description:
 *                 type: string
 *                 description: Opis wydarzenia
 *     responses:
 *       201:
 *         description: Wydarzenie dodane
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
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *       404:
 *         description: Harmonogram nie znaleziony
 *       500:
 *         description: Błąd serwera
 */
router.post('/:scheduleId/events', scheduleController.addEvent);

/**
 * @swagger
 * /api/schedule/{scheduleId}/events/{eventId}:
 *   put:
 *     summary: Aktualizuj wydarzenie
 *     tags: [Harmonogram]
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID harmonogramu
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID wydarzenia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tytuł wydarzenia
 *               startTime:
 *                 type: string
 *                 description: Czas rozpoczęcia (HH:MM)
 *               endTime:
 *                 type: string
 *                 description: Czas zakończenia (HH:MM)
 *               description:
 *                 type: string
 *                 description: Opis wydarzenia
 *     responses:
 *       200:
 *         description: Wydarzenie zaktualizowane
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
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *       404:
 *         description: Harmonogram lub wydarzenie nie znalezione
 *       500:
 *         description: Błąd serwera
 */
router.put('/:scheduleId/events/:eventId', scheduleController.updateEvent);

/**
 * @swagger
 * /api/schedule/{scheduleId}/events/{eventId}:
 *   delete:
 *     summary: Usuń wydarzenie
 *     tags: [Harmonogram]
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID harmonogramu
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID wydarzenia
 *     responses:
 *       204:
 *         description: Wydarzenie usunięte
 *       404:
 *         description: Harmonogram lub wydarzenie nie znalezione
 *       500:
 *         description: Błąd serwera
 */
router.delete('/:scheduleId/events/:eventId', scheduleController.deleteEvent);

module.exports = router; 