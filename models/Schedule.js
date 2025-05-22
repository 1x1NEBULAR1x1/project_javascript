const db = require('./database');

class Schedule {
  static getAll() {
    return db.prepare('SELECT * FROM schedule ORDER BY start_date ASC').all();
  }

  static getByDate(date) {
    if (!date) return null;

    const exactMatch = db.prepare('SELECT * FROM schedule WHERE created_at = ?').get(date);
    if (exactMatch) {
      exactMatch.events = this.getEventsByScheduleId(exactMatch.id);
      return exactMatch;
    }

    if (date && date.length === 10 && date.includes('-')) {
      const startOfDay = `${date}T00:00:00`;
      const endOfDay = `${date}T23:59:59`;

      const rangeMatch = db.prepare(`
        SELECT * FROM schedule 
        WHERE (start_date <= ? AND end_date >= ?) 
           OR (DATE(start_date) = DATE(?))
      `).get(endOfDay, startOfDay, date);

      if (rangeMatch) {
        rangeMatch.events = this.getEventsByScheduleId(rangeMatch.id);
        return rangeMatch;
      }
    } else {
      const data = db.prepare('SELECT * FROM schedule WHERE start_date <= ? AND end_date >= ?').get(date, date);

      if (data) {
        data.events = this.getEventsByScheduleId(data.id);
        return data;
      }
    }

    return null;
  }

  static getById(id) {
    const schedule = db.prepare('SELECT * FROM schedule WHERE id = ?').get(id);

    if (schedule) {
      schedule.events = this.getEventsByScheduleId(schedule.id);
    }

    return schedule;
  }

  // Tworzenie nowego harmonogramu
  static create(eventData) {
    const { title, description, start_date, end_date } = eventData;

    let plainDate = '';
    if (start_date && start_date.includes('T')) {
      plainDate = start_date.split('T')[0];
    } else {
      plainDate = start_date;
    }

    const stmt = db.prepare(`
      INSERT INTO schedule (title, description, start_date, end_date, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title, description, start_date, end_date, plainDate);

    if (result.changes > 0) {
      return this.getById(result.lastInsertRowid);
    }
    return null;
  }

  // Aktualizacja wydarzenia
  static update(id, eventData) {
    const { title, description, start_date, end_date } = eventData;

    // Aktualizacja pola 'date' razem z innymi polami
    let plainDate = '';
    if (start_date && start_date.includes('T')) {
      plainDate = start_date.split('T')[0];
    } else {
      plainDate = start_date;
    }

    const stmt = db.prepare(`
      UPDATE schedule
      SET title = ?, description = ?, start_date = ?, end_date = ?, date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(title, description, start_date, end_date, plainDate, id);

    if (result.changes > 0) {
      return this.getById(id);
    }
    return null;
  }

  // Usuwanie wydarzenia
  static delete(id) {
    const stmt = db.prepare('DELETE FROM schedule WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static getByDateRange(startDate, endDate) {
    return db.prepare(`
      SELECT * FROM schedule 
      WHERE (start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?)
         OR (date BETWEEN ? AND ?)
      ORDER BY start_date ASC
    `).all(startDate, endDate, startDate, endDate, startDate, endDate);
  }

  // Dodanie wydarzenia do harmonogramu
  static addEvent(scheduleId, eventData) {
    const { title, start_time, end_time, description = '' } = eventData;
    console.log(scheduleId, eventData);
    // Sprawdzenie czy harmonogram istnieje
    const schedule = this.getById(scheduleId);
    if (!schedule) {
      return null;
    }

    // Dodanie wydarzenia
    const stmt = db.prepare(`
      INSERT INTO schedule_events (schedule_id, title, description, startTime, endTime)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(scheduleId, title, description, start_time, end_time);
    if (result.changes > 0) {
      return this.getEventById(result.lastInsertRowid);
    }
    return null;
  }

  // Pobieranie wydarzenia po ID
  static getEventById(eventId) {
    return db.prepare('SELECT * FROM schedule_events WHERE id = ?').get(eventId);
  }

  // Pobieranie wszystkich wydarzeń dla harmonogramu
  static getEventsByScheduleId(scheduleId) {
    return db.prepare('SELECT * FROM schedule_events WHERE schedule_id = ? ORDER BY startTime ASC').all(scheduleId);
  }

  // Aktualizacja wydarzenia
  static updateEvent(scheduleId, eventId, eventData) {
    const event = db.prepare('SELECT * FROM schedule_events WHERE id = ? AND schedule_id = ?').get(eventId, scheduleId);

    if (!event) {
      return null;
    }

    const { title, startTime, endTime, description } = eventData;

    const stmt = db.prepare(`
      UPDATE schedule_events
      SET title = ?, description = ?, startTime = ?, endTime = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND schedule_id = ?
    `);

    const result = stmt.run(title, description, startTime, endTime, eventId, scheduleId);

    if (result.changes > 0) {
      return this.getEventById(eventId);
    }
    return null;
  }

  // Usuwanie wydarzenia
  static deleteEvent(scheduleId, eventId) {
    const stmt = db.prepare('DELETE FROM schedule_events WHERE id = ? AND schedule_id = ?');
    const result = stmt.run(eventId, scheduleId);
    return result.changes > 0;
  }
}

module.exports = Schedule; 