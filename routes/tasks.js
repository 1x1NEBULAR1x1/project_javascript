const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Pobierz wszystkie zadania
 *     tags: [Zadania]
 *     responses:
 *       200:
 *         description: Lista wszystkich zadań
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
 *                   example: 2
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', tasksController.getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Pobierz zadanie według ID
 *     tags: [Zadania]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID zadania
 *     responses:
 *       200:
 *         description: Zadanie znalezione
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
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       404:
 *         description: Zadanie nie znalezione
 *       500:
 *         description: Błąd serwera
 */
router.get('/:id', tasksController.getTask);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Utwórz nowe zadanie
 *     tags: [Zadania]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tytuł zadania
 *               description:
 *                 type: string
 *                 description: Opis zadania
 *               status:
 *                 type: string
 *                 description: Status zadania
 *                 enum: [do zrobienia, w trakcie, zakończone]
 *                 default: do zrobienia
 *               priority:
 *                 type: string
 *                 description: Priorytet zadania
 *                 enum: [niski, średni, wysoki]
 *                 default: średni
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Termin wykonania zadania
 *     responses:
 *       201:
 *         description: Zadanie utworzone
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
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       500:
 *         description: Błąd serwera
 */
router.post('/', tasksController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Aktualizuj zadanie
 *     tags: [Zadania]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID zadania
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [do zrobienia, w trakcie, zakończone]
 *               priority:
 *                 type: string
 *                 enum: [niski, średni, wysoki]
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Zadanie zaktualizowane
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
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       404:
 *         description: Zadanie nie znalezione
 *       500:
 *         description: Błąd serwera
 */
router.put('/:id', tasksController.updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Usuń zadanie
 *     tags: [Zadania]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID zadania
 *     responses:
 *       204:
 *         description: Zadanie usunięte
 *       404:
 *         description: Zadanie nie znalezione
 *       500:
 *         description: Błąd serwera
 */
router.delete('/:id', tasksController.deleteTask);

module.exports = router; 