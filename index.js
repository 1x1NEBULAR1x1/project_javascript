const express = require('express');
const path = require('path');
const { swaggerUi, specs } = require('./swagger');
const cors = require('cors');
// Inicjalizacja bazy danych
require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files from React build
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Dokumentacja Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Logowanie żądań
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

try {
  // Importowanie routerów
  const indexRouter = require('./routes/index');
  const tasksRouter = require('./routes/tasks');
  const scheduleRouter = require('./routes/schedule');
  const pomodoroRouter = require('./routes/pomodoro');

  // Używanie routerów
  app.use('/', indexRouter);
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

// Serving React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Handling non-existent paths (only for API routes)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ścieżka nie znaleziona'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('To rebuild the frontend go to the /frontend directory and run: npm run build');
  console.log(`Frontend available at: http://localhost:${PORT}`);
  console.log(`API documentation available at: http://localhost:${PORT}/api-docs`);
});

module.exports = app; 