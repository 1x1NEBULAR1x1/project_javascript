const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const Task = require('../models/Task');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: ID zadania
 *         title:
 *           type: string
 *           description: Tytuł zadania
 *         description:
 *           type: string
 *           description: Opis zadania
 *         status:
 *           type: string
 *           description: Status zadania (todo, in_progress, done)
 *         priority:
 *           type: integer
 *           description: Priorytet (1-5)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data utworzenia
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data aktualizacji
 */

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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', tasksController.getAllTasks);

/**
 * @swagger
 * /api/tasks/status/{status}:
 *   get:
 *     summary: Pobierz zadania według statusu
 *     tags: [Zadania]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Status zadania (todo, in_progress, done)
 *     responses:
 *       200:
 *         description: Lista zadań o podanym statusie
 */
router.get('/status/:status', tasksController.getTasksByStatus);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Pobierz zadanie według ID
 *     tags: [Zadania]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zadania
 *     responses:
 *       200:
 *         description: Zadanie znalezione
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Zadanie nie znalezione
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
 *               priority:
 *                 type: integer
 *                 description: Priorytet zadania
 *     responses:
 *       201:
 *         description: Zadanie utworzone
 *       400:
 *         description: Nieprawidłowe dane
 */
router.post('/', tasksController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Aktualizuj zadanie (częściowo lub w całości)
 *     tags: [Zadania]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               priority:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Zadanie zaktualizowane
 *       404:
 *         description: Zadanie nie znalezione
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
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Zadanie usunięte
 *       404:
 *         description: Zadanie nie znalezione
 */
router.delete('/:id', tasksController.deleteTask);

module.exports = router; 