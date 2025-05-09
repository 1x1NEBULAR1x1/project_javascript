import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TaskManager from './components/TaskManager'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <h1>Task Manager</h1>
        <TaskManager />
      </div>
    </QueryClientProvider>
  )
}

export default App
