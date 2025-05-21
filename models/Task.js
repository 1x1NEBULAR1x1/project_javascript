const db = require('./database');

class Task {
  // Pobieranie wszystkich zadań
  static getAll() {
    return db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  }

  // Pobieranie zadania po ID
  static getById(id) {
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  }

  // Tworzenie nowego zadania
  static create(taskData) {
    const { title, description, status = 'todo', priority = 1 } = taskData;

    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, status, priority)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(title, description, status, priority);

    if (result.changes > 0) {
      return this.getById(result.lastInsertRowid);
    }
    return null;
  }

  // Aktualizacja zadania
  static update(id, taskData) {
    let { title, description, status, priority } = taskData;

    const old_task = this.getById(id);

    if (!old_task) {
      return null;
    }

    if (title === undefined) {
      title = old_task.title;
    }

    if (description === undefined) {
      description = old_task.description;
    }

    if (status === undefined) {
      status = old_task.status;
    }

    if (priority === undefined) {
      priority = old_task.priority;
    }

    const stmt = db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(title, description, status, priority, id);

    if (result.changes > 0) {
      return this.getById(id);
    }
    return null;
  }

  // Usuwanie zadania
  static delete(id) {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static getByStatus(status) {
    return db.prepare('SELECT * FROM tasks WHERE status = ? ORDER BY priority DESC').all(status);
  }
}

module.exports = Task; 