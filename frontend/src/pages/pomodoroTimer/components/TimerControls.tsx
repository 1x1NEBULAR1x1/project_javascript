import { usePomodoroStore } from '../hooks/usePomodoroStore';
import { usePomodoro } from '../hooks/usePomodoro';
import { useSessionHistory } from '../hooks/useSessionHistory';

const TimerControls = () => {
  const { active, startTimer, pauseTimer, resetPomodoroTimer, skipTimer } = usePomodoro();
  const { refreshSessions } = useSessionHistory();
  const selected_task = usePomodoroStore(state => state.selected_task);

  const handleStart = () => {
    startTimer(selected_task);
  };

  const handleSkip = () => {
    skipTimer();
    refreshSessions();
  };

  return (
    <div className="timer_controls">
      {!active ? (
        <button className="btn_start" onClick={handleStart}>
          Start
        </button>
      ) : (
        <button className="btn_pause" onClick={pauseTimer}>
          Pauza
        </button>
      )}
      <button className="btn_reset" onClick={resetPomodoroTimer}>
        Reset
      </button>
      <button className="btn_skip" onClick={handleSkip}>
        Pomiń
      </button>
    </div>
  );
};

export { TimerControls };
