const Task = require('../models/Task');

// Pobieranie wszystkich zadań
exports.getAllTasks = (req, res) => {
  try {
    const tasks = Task.getAll();
    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania zadań',
      error: error.message
    });
  }
};

// Pobieranie pojedynczego zadania
exports.getTask = (req, res) => {
  try {
    const task = Task.getById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nie znaleziono zadania o podanym ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania zadania',
      error: error.message
    });
  }
};

// Tworzenie nowego zadania
exports.createTask = (req, res) => {
  try {
    const newTask = Task.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        task: newTask
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas tworzenia zadania',
      error: error.message
    });
  }
};

// Aktualizacja zadania
exports.updateTask = (req, res) => {
  try {
    const updatedTask = Task.update(req.params.id, req.body);

    if (!updatedTask) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nie znaleziono zadania o podanym ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        task: updatedTask
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas aktualizacji zadania',
      error: error.message
    });
  }
};

// Usuwanie zadania
exports.deleteTask = (req, res) => {
  try {
    const result = Task.delete(req.params.id);

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nie znaleziono zadania o podanym ID'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas usuwania zadania',
      error: error.message
    });
  }
};

// Pobieranie zadań według statusu
exports.getTasksByStatus = (req, res) => {
  try {
    const status = req.params.status;
    const tasks = Task.getByStatus(status);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Błąd podczas pobierania zadań według statusu',
      error: error.message
    });
  }
}; 