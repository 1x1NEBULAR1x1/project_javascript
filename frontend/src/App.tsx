import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TasksPage from './pages/tasks/TasksPage';
import SchedulePage from './pages/schedule/SchedulePage';
import PomodoroPage from './pages/pomodoroTimer/PomodoroPage';
import { NotificationProvider } from './notification/NotificationContext';
import NotificationDisplay from './notification/NotificationDisplay';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggle_menu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Router>
          <div className="app">
            <header className="header">
              <button className="menu_toggle" onClick={toggle_menu}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <h1>Organizer Zadań</h1>
            </header>

            <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
              <nav className="main_nav">
                <NavLink to="/" end onClick={() => setMenuOpen(false)}>
                  Zadania
                </NavLink>
                <NavLink to="/schedule" onClick={() => setMenuOpen(false)}>
                  Harmonogram
                </NavLink>
                <NavLink to="/pomodoro" onClick={() => setMenuOpen(false)}>
                  Timer
                </NavLink>
              </nav>
            </div>

            <main className="main_content">
              <NotificationDisplay />
              <Routes>
                <Route path="/" element={<TasksPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/pomodoro" element={<PomodoroPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;
