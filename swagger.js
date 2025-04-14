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
          required: ['date'],
          properties: {
            id: {
              type: 'string',
              description: 'Identyfikator harmonogramu',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Data harmonogramu',
            },
            events: {
              type: 'array',
              description: 'Lista wydarzeń',
              items: {
                $ref: '#/components/schemas/Event',
              },
            },
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
            workDuration: {
              type: 'integer',
              description: 'Czas pracy w minutach',
            },
            breakDuration: {
              type: 'integer',
              description: 'Czas przerwy w minutach',
            },
            longBreakDuration: {
              type: 'integer',
              description: 'Czas długiej przerwy w minutach',
            },
            longBreakInterval: {
              type: 'integer',
              description: 'Liczba sesji przed długą przerwą',
            },
          },
        },
        PomodoroSession: {
          type: 'object',
          required: ['date', 'completedSessions', 'totalTime'],
          properties: {
            id: {
              type: 'string',
              description: 'Identyfikator sesji',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Data sesji',
            },
            completedSessions: {
              type: 'integer',
              description: 'Liczba ukończonych sesji',
            },
            totalTime: {
              type: 'integer',
              description: 'Całkowity czas pracy w minutach',
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