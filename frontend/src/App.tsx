import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import TaskManager from './components/tasks/TaskManager'
import PomodoroTimer from './components/pomadoroTimer/PomodoroTimer'
import ScheduleComponent from './components/schedule/ScheduleComponent'
import { NotificationProvider } from './context/NotificationContext'

const queryClient = new QueryClient()

function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'tasks' | 'pomodoro' | 'schedule'>('all');

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <div className="app-container">
          <header>
            <h1>System Zarządzania Zadaniami</h1>
            <nav className="app-nav">
              <button
                className={`nav-button ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Wszystko
              </button>
              <button
                className={`nav-button ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                Zadania
              </button>
              <button
                className={`nav-button ${activeTab === 'pomodoro' ? 'active' : ''}`}
                onClick={() => setActiveTab('pomodoro')}
              >
                Pomodoro
              </button>
              <button
                className={`nav-button ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedule')}
              >
                Harmonogram
              </button>
            </nav>
          </header>

          <main className="app-content">
            {(activeTab === 'all' || activeTab === 'tasks') && (
              <section className={`app-section ${activeTab !== 'all' ? 'full-width' : ''}`}>
                <h2>Zadania</h2>
                <TaskManager />
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'pomodoro') && (
              <section className={`app-section ${activeTab !== 'all' ? 'full-width' : ''}`}>
                <h2>Pomodoro</h2>
                <PomodoroTimer />
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'schedule') && (
              <section className={`app-section ${activeTab !== 'all' ? 'full-width' : ''}`}>
                <h2>Harmonogram</h2>
                <ScheduleComponent />
              </section>
            )}
          </main>

          <footer>
            <p>&copy; 2023 System Zarządzania Zadaniami</p>
          </footer>

        </div>
      </NotificationProvider>
    </QueryClientProvider>
  )
}

export default App
