# Aplikacja typu Trello

Aplikacja zarządzania zadaniami z funkcjonalnością harmonogramu dziennego oraz timera Pomodoro.

## Funkcjonalności

- Zarządzanie zadaniami (dodawanie, edycja, usuwanie)
- Harmonogram dzienny (planowanie wydarzeń)
- Timer Pomodoro (zarządzanie sesjami pracy i odpoczynku)
- Baza danych JSON (z możliwością przyszłej migracji do SQLite)
- Dokumentacja API (Swagger)

## Struktura projektu

```
projektTrello/
│
├── controllers/       # Kontrolery aplikacji
│   ├── tasksController.js
│   ├── scheduleController.js
│   └── pomodoroController.js
│
├── models/           # Modele danych
│   ├── Pomadoro.js
│   ├── Schedule.js
│   ├── Task.js
│   └── dbModel.js
│
├── routes/           # Definicje tras API
│   ├── tasks.js
│   ├── schedule.js
│   └── pomodoro.js
│
├── data/             # Dane aplikacji
│   └── database.json
│
├── index.js          # Plik główny aplikacji
├── swagger.js        # Konfiguracja Swagger
├── package.json      # Konfiguracja projektu
└── README.md         # Dokumentacja projektu
```

## Wymagania

- Node.js
- npm

## Instalacja

```
npm install
```

## Uruchomienie

1. Uruchomienie w trybie produkcyjnym:
```
npm start
```

2. Uruchomienie w trybie deweloperskim (z automatycznym restartem):
```
npm run dev
```

Aplikacja będzie dostępna na `http://localhost:3000`.
Dokumentacja API (Swagger) będzie dostępna na `http://localhost:3000/api-docs`.

## Endpointy API

### Zadania

- `GET /api/tasks` - Pobierz wszystkie zadania
- `GET /api/tasks/:id` - Pobierz konkretne zadanie
- `POST /api/tasks` - Utwórz nowe zadanie
- `PUT /api/tasks/:id` - Zaktualizuj zadanie
- `DELETE /api/tasks/:id` - Usuń zadanie

### Harmonogram

- `GET /api/schedule` - Pobierz wszystkie harmonogramy
- `GET /api/schedule/:date` - Pobierz harmonogram dla konkretnej daty
- `POST /api/schedule` - Utwórz nowy harmonogram
- `POST /api/schedule/:scheduleId/events` - Dodaj nowe wydarzenie
- `PUT /api/schedule/:scheduleId/events/:eventId` - Zaktualizuj wydarzenie
- `DELETE /api/schedule/:scheduleId/events/:eventId` - Usuń wydarzenie

### Pomodoro

- `GET /api/pomodoro/settings` - Pobierz ustawienia pomodoro
- `PUT /api/pomodoro/settings` - Zaktualizuj ustawienia pomodoro
- `GET /api/pomodoro/sessions` - Pobierz wszystkie sesje pomodoro
- `GET /api/pomodoro/sessions/:date` - Pobierz sesje dla konkretnej daty
- `POST /api/pomodoro/sessions` - Zapisz nową sesję pomodoro 