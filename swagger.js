const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aplikacja typu Trello API',
      version: '1.0.0',
      description: 'API dla aplikacji zarządzania zadaniami z harmonogramem i timerem Pomodoro',
      contact: {
        name: 'Wsparcie API',
        email: 'kontakt@przyklad.pl',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serwer lokalny',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'string',
              description: 'Identyfikator zadania',
            },
            title: {
              type: 'string',
              description: 'Tytuł zadania',
            },
            description: {
              type: 'string',
              description: 'Opis zadania',
            },
            status: {
              type: 'string',
              description: 'Status zadania',
              enum: ['do zrobienia', 'w trakcie', 'zakończone'],
            },
            priority: {
              type: 'string',
              description: 'Priorytet zadania',
              enum: ['niski', 'średni', 'wysoki'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data utworzenia zadania',
            },
            deadline: {
              type: 'string',
              format: 'date-time',
              description: 'Termin wykonania zadania',
            },
          },
        },
        Schedule: {
          type: 'object',
          required: ['title', 'start_date', 'end_date'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID harmonogramu',
            },
            title: {
              type: 'string',
              description: 'Tytuł wydarzenia',
            },
            description: {
              type: 'string',
              description: 'Opis wydarzenia',
            },
            start_date: {
              type: 'string',
              format: 'date-time',
              description: 'Data i czas rozpoczęcia',
            },
            end_date: {
              type: 'string',
              format: 'date-time',
              description: 'Data i czas zakończenia',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data utworzenia',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data aktualizacji',
            }
          },
        },
        Event: {
          type: 'object',
          required: ['title', 'startTime', 'endTime'],
          properties: {
            id: {
              type: 'string',
              description: 'Identyfikator wydarzenia',
            },
            title: {
              type: 'string',
              description: 'Tytuł wydarzenia',
            },
            startTime: {
              type: 'string',
              description: 'Czas rozpoczęcia',
            },
            endTime: {
              type: 'string',
              description: 'Czas zakończenia',
            },
            description: {
              type: 'string',
              description: 'Opis wydarzenia',
            },
          },
        },
        PomodoroSettings: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID ustawień (zawsze 1)',
            },
            work_duration: {
              type: 'integer',
              description: 'Czas pracy w minutach',
            },
            break_duration: {
              type: 'integer',
              description: 'Czas przerwy w minutach',
            },
            long_break_duration: {
              type: 'integer',
              description: 'Czas długiej przerwy w minutach',
            },
            long_break_interval: {
              type: 'integer',
              description: 'Liczba sesji przed długą przerwą',
            },
          },
        },
        PomodoroSession: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID sesji',
            },
            task_id: {
              type: 'integer',
              description: 'ID powiązanego zadania',
            },
            start_time: {
              type: 'string',
              format: 'date-time',
              description: 'Czas rozpoczęcia sesji',
            },
            end_time: {
              type: 'string',
              format: 'date-time',
              description: 'Czas zakończenia sesji',
            },
            duration: {
              type: 'integer',
              description: 'Czas trwania sesji w minutach',
            },
            type: {
              type: 'string',
              description: 'Typ sesji (work, break, long_break)',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Status odpowiedzi',
            },
            message: {
              type: 'string',
              description: 'Komunikat błędu',
            },
            error: {
              type: 'object',
              description: 'Szczegóły błędu',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Ścieżki do plików z komentarzami dokumentacji
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs }; 