'use strict';

const db = require('./database');

class Pomodoro {
  // Pobieranie ustawień pomodoro
  static getSettings() {
    return db.prepare('SELECT * FROM pomodoro_settings WHERE id = 1').get();
  }

  // Aktualizacja ustawień pomodoro
  static updateSettings(settingsData) {
    const currentSettings = this.getSettings();

    const work_duration = settingsData.work_duration !== undefined ? settingsData.work_duration : currentSettings.work_duration;
    const break_duration = settingsData.break_duration !== undefined ? settingsData.break_duration : currentSettings.break_duration;
    const long_break_duration = settingsData.long_break_duration !== undefined ? settingsData.long_break_duration : currentSettings.long_break_duration;
    const long_break_interval = settingsData.long_break_interval !== undefined ? settingsData.long_break_interval : currentSettings.long_break_interval;

    const stmt = db.prepare(`
      UPDATE pomodoro_settings
      SET work_duration = ?, break_duration = ?, long_break_duration = ?, long_break_interval = ?
      WHERE id = 1
    `);

    const result = stmt.run(work_duration, break_duration, long_break_duration, long_break_interval);

    if (result.changes > 0) {
      return this.getSettings();
    }
    return null;
  }

  // Pobieranie wszystkich sesji
  static getAllSessions() {
    return db.prepare(`
      SELECT ps.*, t.title as task_title
      FROM pomodoro_sessions ps
      LEFT JOIN tasks t ON ps.task_id = t.id
      ORDER BY ps.start_time DESC
    `).all();
  }

  // Pobieranie sesji po dacie
  static getSessionsByDate(date) {
    const query = `
      SELECT 
        ps.id, 
        ps.task_id, 
        ps.start_time, 
        ps.end_time, 
        ps.duration, 
        ps.type,
        t.title as task_title
      FROM pomodoro_sessions ps
      LEFT JOIN tasks t ON ps.task_id = t.id
      WHERE DATE(ps.start_time) = DATE(?)
      ORDER BY ps.start_time DESC
    `;

    const sessions = db.prepare(query).all(date);
    return sessions;
  }

  // Pobieranie sesji po id
  static getSessionById(id) {
    return db.prepare(`
      SELECT ps.*, t.title as task_title
      FROM pomodoro_sessions ps
      LEFT JOIN tasks t ON ps.task_id = t.id
      WHERE ps.id = ?
    `).get(id);
  }

  // Pobieranie sesji po id zadania
  static getSessionsByTaskId(taskId) {
    return db.prepare(`
      SELECT ps.*, t.title as task_title
      FROM pomodoro_sessions ps
      LEFT JOIN tasks t ON ps.task_id = t.id
      WHERE ps.task_id = ?
      ORDER BY ps.start_time DESC
    `).all(taskId);
  }

  // Zapisywanie nowej sesji
  static createSession(sessionData) {
    const { task_id, start_time, duration, type } = sessionData;

    const stmt = db.prepare(`
      INSERT INTO pomodoro_sessions (task_id, start_time, duration, type)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(task_id, start_time, duration, type);

    if (result.changes > 0) {
      const newSession = this.getSessionById(result.lastInsertRowid);
      return newSession;
    }
    return null;
  }

  // Aktualizacja sesji
  static updateSession(id, updateData) {
    const currentSession = this.getSessionById(id);
    if (!currentSession) {
      return null;
    }

    let query = 'UPDATE pomodoro_sessions SET ';
    const values = [];
    const fields = [];

    // Dynamicznie dodajemy pola do aktualizacji
    if (updateData.task_id !== undefined) {
      fields.push('task_id = ?');
      values.push(updateData.task_id);
    }
    if (updateData.start_time !== undefined) {
      fields.push('start_time = ?');
      values.push(updateData.start_time);
    }
    if (updateData.end_time !== undefined) {
      fields.push('end_time = ?');
      values.push(updateData.end_time);
    }
    if (updateData.duration !== undefined) {
      fields.push('duration = ?');
      values.push(updateData.duration);
    }
    if (updateData.type !== undefined) {
      fields.push('type = ?');
      values.push(updateData.type);
    }

    if (fields.length === 0) {
      return currentSession;
    }

    query += fields.join(', ') + ' WHERE id = ?';
    values.push(id);

    const stmt = db.prepare(query);
    const result = stmt.run(...values);

    if (result.changes > 0) {
      return this.getSessionById(id);
    }
    return null;
  }

  // Zakończenie sesji
  static completeSession(id, end_time) {
    return this.updateSession(id, { end_time });
  }

  // Usuwanie sesji
  static deleteSession(id) {
    const stmt = db.prepare('DELETE FROM pomodoro_sessions WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = Pomodoro; 