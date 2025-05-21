import { usePomodoroStore } from '../hooks/usePomodoroStore';
import { usePomodoro } from '../hooks/usePomodoro';

const TimerControls = () => {
  const { active, startTimer, pauseTimer, resetPomodoroTimer, skipTimer } = usePomodoro();
  const selected_task = usePomodoroStore(state => state.selected_task);

  const handle_start = () => {
    startTimer(selected_task);
  };

  return (
    <div className="timer_controls">
      {!active ? (
        <button className="btn_start" onClick={handle_start}>
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
      <button className="btn_skip" onClick={skipTimer}>
        Pomiń
      </button>
    </div>
  );
};

export { TimerControls };
