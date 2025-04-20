const db = require('./database');

class Schedule {
  // Pobieranie wszystkich harmonogramów
  static getAll() {
    return db.prepare('SELECT * FROM schedule ORDER BY start_date ASC').all();
  }
  
  // Pobieranie harmonogramu po dacie
  static getByDate(date) {
    const data = db.prepare('SELECT * FROM schedule WHERE start_date <= ? AND end_date >= ?').get(date, date);
    
    if (data) {
      // Добавляем связанные события
      data.events = this.getEventsByScheduleId(data.id);
    }
    
    return data;
  }
  
  // Pobieranie harmonogramu po ID
  static getById(id) {
    const schedule = db.prepare('SELECT * FROM schedule WHERE id = ?').get(id);
    
    if (schedule) {
      // Добавляем связанные события
      schedule.events = this.getEventsByScheduleId(schedule.id);
    }
    
    return schedule;
  }
  
  // Tworzenie nowego harmonogramu
  static create(eventData) {
    const { title, description, start_date, end_date } = eventData;
    
    const stmt = db.prepare(`
      INSERT INTO schedule (title, description, start_date, end_date)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(title, description, start_date, end_date);
    
    if (result.changes > 0) {
      return this.getById(result.lastInsertRowid);
    }
    return null;
  }
  
  // Aktualizacja wydarzenia
  static update(id, eventData) {
    const { title, description, start_date, end_date } = eventData;
    
    const stmt = db.prepare(`
      UPDATE schedule
      SET title = ?, description = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(title, description, start_date, end_date, id);
    
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
      ORDER BY start_date ASC
    `).all(startDate, endDate, startDate, endDate);
  }
  
  // Dodanie wydarzenia do harmonogramu
  static addEvent(scheduleId, eventData) {
    const { title, startTime, endTime, description = '' } = eventData;
    
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
    
    const result = stmt.run(scheduleId, title, description, startTime, endTime);
    
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