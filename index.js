const express = require('express');
const path = require('path');
const { swaggerUi, specs } = require('./swagger');

// Inicjalizacja bazy danych
require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Dokumentacja Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Logowanie żądań
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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
    message: 'Błąd serwera!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Obsługa nieistniejących ścieżek
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ścieżka nie znaleziona'
  });
});

app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
  console.log(`Dokumentacja API dostępna pod adresem: http://localhost:${PORT}/api-docs`);
});

module.exports = app; 