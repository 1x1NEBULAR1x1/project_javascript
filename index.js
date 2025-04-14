const express = require('express');
const path = require('path');
const fs = require('fs');
const { swaggerUi, specs } = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger dokumentacja
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Logowanie żądań
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Sprawdzanie, czy katalog z danymi istnieje
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log(`Utworzono katalog: ${dataDir}`);
}

// Sprawdzanie, czy plik bazy danych istnieje
const dbPath = path.join(dataDir, 'database.json');
if (!fs.existsSync(dbPath)) {
  const defaultData = {
    tasks: [],
    schedule: [],
    pomodoro: {
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      sessions: []
    }
  };
  fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  console.log(`Utworzono plik bazy danych: ${dbPath}`);
}

try {
  // Importowanie routerów
  const tasksRouter = require('./routes/tasks');
  const scheduleRouter = require('./routes/schedule');
  const pomodoroRouter = require('./routes/pomodoro');

  // Używanie routerów
  app.use('/api/tasks', tasksRouter);
  app.use('/api/schedule', scheduleRouter);
  app.use('/api/pomodoro', pomodoroRouter);
} catch (error) {
  console.error('Błąd podczas konfiguracji routerów:', error);
  throw error;
}

// Obsługa błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Wystąpił błąd na serwerze!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Obsługa nieistniejących ścieżek
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Nie znaleziono podanej ścieżki'
  });
});

app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
  console.log(`Dokumentacja API dostępna pod adresem: http://localhost:${PORT}/api-docs`);
});

module.exports = app; 