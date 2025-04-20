const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Sprawdzenie czy istnieje folder data
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log(`Utworzono folder: ${dataDir}`);
}

// Połączenie z bazą danych
const dbPath = path.join(dataDir, 'trello.db');
const db = new Database(dbPath);

// Włączenie trybu kluczy obcych
db.pragma('foreign_keys = ON');

// Tworzenie tabel, jeśli nie istnieją
function initDatabase() {
  // Tabela zadań
  db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo',
      priority INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Tabela harmonogramu
  db.prepare(`
    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Tabela wydarzeń harmonogramu
  db.prepare(`
    CREATE TABLE IF NOT EXISTS schedule_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      schedule_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE
    )
  `).run();

  // Tabela sesji pomodoro
  db.prepare(`
    CREATE TABLE IF NOT EXISTS pomodoro_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP,
      duration INTEGER NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
    )
  `).run();

  // Tabela ustawień pomodoro
  db.prepare(`
    CREATE TABLE IF NOT EXISTS pomodoro_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      work_duration INTEGER NOT NULL DEFAULT 25,
      break_duration INTEGER NOT NULL DEFAULT 5,
      long_break_duration INTEGER NOT NULL DEFAULT 15,
      long_break_interval INTEGER NOT NULL DEFAULT 4
    )
  `).run();

  // Sprawdzenie, czy istnieją ustawienia pomodoro, jeśli nie, tworzymy je
  const settings = db.prepare('SELECT * FROM pomodoro_settings WHERE id = 1').get();
  if (!settings) {
    db.prepare(`
      INSERT INTO pomodoro_settings (id, work_duration, break_duration, long_break_duration, long_break_interval)
      VALUES (1, 25, 5, 15, 4)
    `).run();
  }

  console.log('Baza danych została zainicjalizowana');
}

// Inicjalizacja bazy danych
initDatabase();

module.exports = db; 