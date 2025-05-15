const express = require('express');
const router = express.Router();
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
router.get('/', (req, res) => {
  try {
    const tasks = Task.getAll();
    res.json(tasks);
  } catch (error) {
    console.error('Błąd podczas pobierania zadań:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania zadań',
      error: error.message
    });
  }
});

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
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const task = Task.getById(id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Zadanie nie znalezione'
      });
    }

    res.json(task);
  } catch (error) {
    console.error('Błąd podczas pobierania zadania:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania zadania',
      error: error.message
    });
  }
});

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
router.post('/', (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        status: 'error',
        message: 'Tytuł zadania jest wymagany'
      });
    }

    const newTask = Task.create({ title, description, status, priority });

    if (!newTask) {
      return res.status(500).json({
        status: 'error',
        message: 'Nie udało się utworzyć zadania'
      });
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Błąd podczas tworzenia zadania:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas tworzenia zadania',
      error: error.message
    });
  }
});

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
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedFields = req.body;

    // Проверяем, что задача существует
    const existingTask = Task.getById(id);
    if (!existingTask) {
      return res.status(404).json({
        status: 'error',
        message: 'Zadanie nie znalezione'
      });
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Brak danych do aktualizacji'
      });
    }

    const taskData = {
      title: updatedFields.title !== undefined ? updatedFields.title : existingTask.title,
      description: updatedFields.description !== undefined ? updatedFields.description : existingTask.description,
      status: updatedFields.status !== undefined ? updatedFields.status : existingTask.status,
      priority: updatedFields.priority !== undefined ? updatedFields.priority : existingTask.priority
    };

    const updatedTask = Task.update(id, taskData);

    if (!updatedTask) {
      return res.status(500).json({
        status: 'error',
        message: 'Nie udało się zaktualizować zadania'
      });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Błąd podczas aktualizacji zadania:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas aktualizacji zadania',
      error: error.message
    });
  }
});

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
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const task = Task.getById(id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Zadanie nie znalezione'
      });
    }

    const deleted = Task.delete(id);

    if (!deleted) {
      return res.status(500).json({
        status: 'error',
        message: 'Nie udało się usunąć zadania'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Zadanie usunięte pomyślnie'
    });
  } catch (error) {
    console.error('Błąd podczas usuwania zadania:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas usuwania zadania',
      error: error.message
    });
  }
});

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
router.get('/status/:status', (req, res) => {
  try {
    const status = req.params.status;
    const tasks = Task.getByStatus(status);
    res.json(tasks);
  } catch (error) {
    console.error('Błąd podczas pobierania zadań według statusu:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania zadań według statusu',
      error: error.message
    });
  }
});

module.exports = router; 