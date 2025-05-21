# Aplikacja typu Trello

Aplikacja zarządzania zadaniami z funkcjonalnością harmonogramu dziennego oraz timera Pomodoro.

## Spis treści

1. [Funkcjonalności](#funkcjonalności)
2. [Struktura projektu](#struktura-projektu)
3. [Technologie](#technologie)
4. [Architektura aplikacji](#architektura-aplikacji)
5. [Moduły aplikacji](#moduły-aplikacji)
   - [Moduł Zadań](#moduł-zadań)
   - [Moduł Harmonogramu](#moduł-harmonogramu)
   - [Moduł Pomodoro](#moduł-pomodoro)
6. [Baza danych](#baza-danych)
7. [API Endpoints](#endpointy-api)
8. [Frontend](#frontend)
9. [Wymagania](#wymagania)
10. [Instalacja](#instalacja)
11. [Uruchomienie](#uruchomienie)

## Funkcjonalności

- Zarządzanie zadaniami (dodawanie, edycja, usuwanie)
- Harmonogram dzienny (planowanie wydarzeń)
- Timer Pomodoro (zarządzanie sesjami pracy i odpoczynku)
- Baza danych SQLite (przez Better SQLite3)
- Dokumentacja API (Swagger)
- Interfejs użytkownika zbudowany w React i TypeScript

## Struktura projektu

```
projektTrello/
│
├── controllers/       # Kontrolery aplikacji (logika biznesowa)
│   ├── tasksController.js
│   ├── scheduleController.js
│   └── pomodoroController.js
│
├── models/           # Modele danych i obsługa bazy danych
│   ├── Pomodoro.js
│   ├── Schedule.js
│   ├── Task.js
│   └── database.js
│
├── routes/           # Definicje tras API
│   ├── tasks.js
│   ├── schedule.js
│   ├── pomodoro.js
│   └── index.js
│
├── data/             # Dane aplikacji i pliki bazy danych
│
├── frontend/         # Aplikacja frontendowa (React + TypeScript)
│   ├── public/       # Statyczne pliki
│   ├── src/          # Kod źródłowy frontendu
│   │   ├── pages/    # Strony aplikacji
│   │   │   ├── tasks/        # Moduł zadań
│   │   │   ├── schedule/     # Moduł harmonogramu
│   │   │   └── pomodoroTimer/# Moduł pomodoro
│   │   ├── App.tsx    # Główny komponent aplikacji
│   │   └── main.tsx   # Punkt wejścia aplikacji
│   ├── dist/        # Zbudowana aplikacja frontendowa
│   └── package.json # Zależności frontendu
│
├── index.js          # Plik główny aplikacji (serwer Express)
├── swagger.js        # Konfiguracja Swagger dla dokumentacji API
├── package.json      # Konfiguracja projektu i zależności
└── README.md         # Dokumentacja projektu
```

## Technologie

### Backend
- Node.js
- Express.js
- Better-SQLite3
- Swagger (dokumentacja API)

### Frontend
- React
- TypeScript
- Vite (budowanie aplikacji)
- React Router (nawigacja)
- TanStack Query (zarządzanie zapytaniami)
- Zustand (zarządzanie stanem)
- Axios (komunikacja z API)

## Architektura aplikacji

Aplikacja została zaprojektowana zgodnie z architekturą MVC (Model-View-Controller):

1. **Model** - Odpowiada za operacje na danych i logikę biznesową
   - Zdefiniowany w katalogu `models/`
   - Zarządza dostępem do bazy danych SQLite
   - Obsługuje walidację danych

2. **Widok** - Interfejs użytkownika
   - Aplikacja React w katalogu `frontend/`
   - Oddzielone moduły dla różnych funkcjonalności (zadania, harmonogram, pomodoro)
   - Wykorzystanie komponentów reaktywnych

3. **Kontroler** - Obsługa żądań i odpowiedzi
   - Zdefiniowany w katalogu `controllers/`
   - Obsługuje logikę przetwarzania żądań HTTP
   - Komunikuje się z modelem i zwraca odpowiedzi do klienta

4. **Routing** - Definiuje dostępne endpointy API
   - Zdefiniowany w katalogu `routes/`
   - Mapuje żądania HTTP na odpowiednie kontrolery

## Moduły aplikacji

### Moduł Zadań

Moduł zadań umożliwia zarządzanie listą zadań do wykonania.

#### Backend:

- **Model (`Task.js`):**
  - Struktura danych zadania:
    - `id` - unikalne ID zadania
    - `title` - tytuł zadania
    - `description` - opis zadania
    - `status` - status zadania (todo, in_progress, done)
    - `priority` - priorytet zadania
    - `created_at` - data utworzenia
    - `updated_at` - data aktualizacji
  - Metody:
    - `getAll()` - pobieranie wszystkich zadań
    - `getById(id)` - pobieranie zadania po ID
    - `create(taskData)` - tworzenie nowego zadania
    - `update(id, taskData)` - aktualizacja zadania
    - `delete(id)` - usuwanie zadania
    - `getByStatus(status)` - pobieranie zadań według statusu

- **Kontroler (`tasksController.js`):**
  - Przetwarza żądania API dotyczące zadań
  - Implementuje logikę biznesową dla operacji na zadaniach
  - Obsługuje odpowiedzi i błędy

- **Router (`tasks.js`):**
  - Definiuje endpointy API dla zadań
  - Mapuje ścieżki URL na metody kontrolera

#### Frontend:

- **Komponenty (`frontend/src/pages/tasks/components/`):**
  - `TaskCard.tsx` - reprezentacja pojedynczego zadania
  - `TaskContainer.tsx` - kontener dla listy zadań
  - `CreateTask.tsx` - formularz tworzenia nowego zadania
  - `EditTask.tsx` - formularz edycji istniejącego zadania

- **Hooki (`frontend/src/pages/tasks/hooks/`):**
  - `useTasks.ts` - główny hook zarządzający logiką zadań
  - `tasksApi.ts` - funkcje komunikacji z API zadań
  - `taskStore.ts` - lokalny stan aplikacji (Zustand)

### Moduł Harmonogramu

Moduł harmonogramu pozwala na planowanie wydarzeń w kalendarzu.

#### Backend:

- **Model (`Schedule.js`):**
  - Struktura danych harmonogramu:
    - `id` - unikalne ID harmonogramu
    - `title` - tytuł harmonogramu
    - `description` - opis harmonogramu
    - `start_date` - data początkowa
    - `end_date` - data końcowa
    - `date` - główna data harmonogramu
    - `created_at` - data utworzenia
    - `updated_at` - data aktualizacji
    - `events` - tablica wydarzeń w harmonogramie
  - Metody:
    - `getAll()` - pobieranie wszystkich harmonogramów
    - `getById(id)` - pobieranie harmonogramu po ID
    - `getByDate(date)` - pobieranie harmonogramu na określoną datę
    - `create(scheduleData)` - tworzenie nowego harmonogramu
    - `update(id, scheduleData)` - aktualizacja harmonogramu
    - `delete(id)` - usuwanie harmonogramu
    - `addEvent(scheduleId, eventData)` - dodawanie wydarzeń do harmonogramu
    - `updateEvent(scheduleId, eventId, eventData)` - aktualizacja wydarzeń
    - `deleteEvent(scheduleId, eventId)` - usuwanie wydarzeń

- **Kontroler (`scheduleController.js`):**
  - Obsługuje logikę biznesową dla harmonogramu i wydarzeń
  - Zarządza operacjami czasowymi i walidacją dat

- **Router (`schedule.js`):**
  - Definiuje endpointy API dla harmonogramu i wydarzeń

#### Frontend:

- **Komponenty (`frontend/src/pages/schedule/components/`):**
  - Formularze i widoki dla harmonogramu i wydarzeń
  - Komponenty kalendarza i wyboru dat
  - Wizualizacja wydarzeń w czasie

- **Hooki (`frontend/src/pages/schedule/hooks/`):**
  - `useSchedule.ts` - główny hook zarządzania harmonogramem
  - `scheduleApi.ts` - komunikacja z API harmonogramu
  - `useScheduleStore.ts` - zarządzanie stanem harmonogramu

### Moduł Pomodoro

Moduł Pomodoro implementuje technikę zarządzania czasem Pomodoro.

#### Backend:

- **Model (`Pomodoro.js`):**
  - Struktura danych sesji:
    - `id` - unikalne ID sesji
    - `task_id` - powiązane zadanie (opcjonalne)
    - `start_time` - czas rozpoczęcia sesji
    - `end_time` - czas zakończenia sesji
    - `duration` - czas trwania w sekundach
    - `type` - typ sesji (work, break, long_break)
  - Struktura ustawień:
    - `work_duration` - czas pracy (minuty)
    - `break_duration` - czas krótkiej przerwy (minuty)
    - `long_break_duration` - czas długiej przerwy (minuty)
    - `long_break_interval` - liczba sesji przed długą przerwą
  - Metody:
    - `getSettings()` - pobieranie ustawień pomodoro
    - `updateSettings(settingsData)` - aktualizacja ustawień
    - `getAllSessions()` - pobieranie wszystkich sesji
    - `getSessionsByDate(date)` - pobieranie sesji na daną datę
    - `createSession(sessionData)` - tworzenie nowej sesji
    - `updateSession(id, updateData)` - aktualizacja sesji
    - `completeSession(id, end_time)` - zakończenie sesji
    - `deleteSession(id)` - usuwanie sesji

- **Kontroler (`pomodoroController.js`):**
  - Obsługuje logikę biznesową dla sesji i ustawień pomodoro
  - Zarządza cyklami pomodoro

- **Router (`pomodoro.js`):**
  - Definiuje endpointy API dla pomodoro

#### Frontend:

- **Komponenty (`frontend/src/pages/pomodoroTimer/components/`):**
  - Timer wizualny z odliczaniem
  - Komponenty zarządzania sesjami
  - Statystyki sesji pomodoro

- **Hooki (`frontend/src/pages/pomodoroTimer/hooks/`):**
  - `usePomodoro.ts` - główny hook zarządzania pomodoro
  - `pomodoroApi.ts` - komunikacja z API pomodoro
  - `usePomodoroStore.ts` - lokalny stan pomodoro

## Baza danych

Aplikacja używa SQLite jako bazy danych za pomocą biblioteki Better-SQLite3.

### Schemat bazy danych

1. **Tabela `tasks`**
   - `id` - INTEGER PRIMARY KEY AUTOINCREMENT
   - `title` - TEXT NOT NULL
   - `description` - TEXT
   - `status` - TEXT DEFAULT 'todo'
   - `priority` - INTEGER DEFAULT 1
   - `created_at` - TIMESTAMP
   - `updated_at` - TIMESTAMP

2. **Tabela `schedule`**
   - `id` - INTEGER PRIMARY KEY AUTOINCREMENT
   - `title` - TEXT NOT NULL
   - `description` - TEXT
   - `start_date` - TIMESTAMP NOT NULL
   - `end_date` - TIMESTAMP NOT NULL
   - `date` - TEXT
   - `created_at` - TIMESTAMP
   - `updated_at` - TIMESTAMP

3. **Tabela `schedule_events`**
   - `id` - INTEGER PRIMARY KEY AUTOINCREMENT
   - `schedule_id` - INTEGER NOT NULL (FOREIGN KEY)
   - `title` - TEXT NOT NULL
   - `description` - TEXT
   - `startTime` - TEXT NOT NULL
   - `endTime` - TEXT NOT NULL
   - `created_at` - TIMESTAMP
   - `updated_at` - TIMESTAMP

4. **Tabela `pomodoro_sessions`**
   - `id` - INTEGER PRIMARY KEY AUTOINCREMENT
   - `task_id` - INTEGER (FOREIGN KEY)
   - `start_time` - TIMESTAMP NOT NULL
   - `end_time` - TIMESTAMP
   - `duration` - INTEGER NOT NULL
   - `type` - TEXT NOT NULL

5. **Tabela `pomodoro_settings`**
   - `id` - INTEGER PRIMARY KEY CHECK (id = 1)
   - `work_duration` - INTEGER NOT NULL DEFAULT 25
   - `break_duration` - INTEGER NOT NULL DEFAULT 5
   - `long_break_duration` - INTEGER NOT NULL DEFAULT 15
   - `long_break_interval` - INTEGER NOT NULL DEFAULT 4

### Inicjalizacja bazy danych

Baza danych jest inicjalizowana automatycznie przy pierwszym uruchomieniu aplikacji. Proces ten obejmuje:
- Tworzenie tabel, jeśli nie istnieją
- Ustawienie domyślnych wartości dla ustawień pomodoro
- Konfiguracja kluczy obcych i relacji między tabelami

## Frontend

Frontend aplikacji to aplikacja Single Page Application (SPA) zbudowana przy użyciu React i TypeScript.

### Struktura frontend

Każdy moduł (zadania, harmonogram, pomodoro) ma podobną strukturę:

- **Strony (`frontend/src/pages/`)** - Główne widoki aplikacji
  - Zawierają logikę wysokiego poziomu dla każdego modułu
  - Integrują komponenty i hooki

- **Komponenty (`components/`)** - Komponenty UI specyficzne dla danego modułu
  - Komponenty prezentacyjne, odpowiedzialne za renderowanie UI
  - Korzystają z hooków do zarządzania danymi

- **Hooki (`hooks/`)** - Niestandardowe hooki React:
  - **Hook główny (`useXXX.ts`)** - Zarządza logiką biznesową dla modułu
    - Łączy zapytania API z lokalnym stanem
    - Obsługuje operacje CRUD i interakcje użytkownika
  - **API client (`xxxApi.ts`)** - Funkcje komunikujące się z backendem
    - Definiuje interfejsy TypeScript dla danych
    - Implementuje funkcje do wysyłania żądań HTTP
  - **Magazyn stanu (`xxxStore.ts`)** - Przechowuje stan lokalny z Zustand
    - Definiuje strukturę stanu
    - Dostarcza akcje do modyfikacji stanu

### Zarządzanie stanem

Aplikacja używa kombinacji kilku podejść do zarządzania stanem:

1. **Zustand** - Do lokalnego stanu aplikacji
   - Przechowuje dane trwale między renderowaniami
   - Udostępnia prosty API do aktualizacji stanu

2. **React Query** - Do stanu serwera i pamięci podręcznej
   - Zarządza zapytaniami i mutacjami API
   - Obsługuje pamięć podręczną, odświeżanie i ponowne próby
   - Synchronizuje stan między komponentami

3. **React Context** - Do globalnego stanu aplikacji
   - Używane do obsługi powiadomień i globalnych ustawień

### Routing

Aplikacja używa React Router dla nawigacji między modułami:
- `/` - Strona zadań
- `/schedule` - Strona harmonogramu
- `/pomodoro` - Strona timera Pomodoro

### Komunikacja z API

Komunikacja z API odbywa się za pomocą biblioteki Axios:
- Konfiguracja w `frontend/src/axiosConfig.ts`
- Obsługa błędów przez interceptory
- Każdy moduł ma własny zestaw funkcji API

## Endpointy API

### Zadania

- `GET /api/tasks` - Pobierz wszystkie zadania
- `GET /api/tasks/:id` - Pobierz konkretne zadanie
- `GET /api/tasks/status/:status` - Pobierz zadania o określonym statusie
- `POST /api/tasks` - Utwórz nowe zadanie
- `PUT /api/tasks/:id` - Zaktualizuj zadanie
- `DELETE /api/tasks/:id` - Usuń zadanie

### Harmonogram

- `GET /api/schedule` - Pobierz wszystkie harmonogramy
- `GET /api/schedule/:id` - Pobierz harmonogram po ID
- `GET /api/schedule/date/:date` - Pobierz harmonogram dla konkretnej daty
- `GET /api/schedule/range/:startDate/:endDate` - Pobierz harmonogramy z zakresu dat
- `POST /api/schedule` - Utwórz nowy harmonogram
- `PUT /api/schedule/:id` - Zaktualizuj harmonogram
- `DELETE /api/schedule/:id` - Usuń harmonogram
- `POST /api/schedule/:scheduleId/events` - Dodaj nowe wydarzenie
- `PUT /api/schedule/:scheduleId/events/:eventId` - Zaktualizuj wydarzenie
- `DELETE /api/schedule/:scheduleId/events/:eventId` - Usuń wydarzenie

### Pomodoro

- `GET /api/pomodoro/settings` - Pobierz ustawienia pomodoro
- `PUT /api/pomodoro/settings` - Zaktualizuj ustawienia pomodoro
- `GET /api/pomodoro/sessions` - Pobierz wszystkie sesje pomodoro
- `GET /api/pomodoro/sessions/:id` - Pobierz sesję po ID
- `GET /api/pomodoro/sessions/date/:date` - Pobierz sesje dla konkretnej daty
- `GET /api/pomodoro/sessions/task/:taskId` - Pobierz sesje dla konkretnego zadania
- `POST /api/pomodoro/sessions` - Zapisz nową sesję pomodoro
- `PUT /api/pomodoro/sessions/:id` - Zaktualizuj sesję pomodoro
- `PUT /api/pomodoro/sessions/:id/complete` - Zakończ sesję pomodoro
- `DELETE /api/pomodoro/sessions/:id` - Usuń sesję pomodoro

## Wymagania

- Node.js (v14 lub nowszy)
- npm (v6 lub nowszy)

## Instalacja

1. Instalacja zależności backendowych:
```
npm install
```

2. Instalacja zależności frontendowych:
```
cd frontend
npm install
```

## Uruchomienie

### Tryb deweloperski

1. Uruchomienie backendu:
```
npm run dev
```

2. Uruchomienie frontendu (w osobnym terminalu):
```
cd frontend
npm run dev
```

Backend będzie dostępny na `http://localhost:3000`.
Frontend deweloperski będzie dostępny na `http://localhost:5173`.

### Tryb produkcyjny

1. Zbudowanie frontendu:
```
cd frontend
npm run build
```

2. Uruchomienie aplikacji:
```
npm start
```

Aplikacja będzie dostępna na `http://localhost:3000`.
Dokumentacja API (Swagger) będzie dostępna na `http://localhost:3000/api-docs`. 