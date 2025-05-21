import { usePomodoro } from '../hooks/usePomodoro';

const TimerType = () => {
  const { current_type, setCurrentType, active } = usePomodoro();
  return (
    <div className="timer_type">
      <button
        className={`type_button ${current_type === 'work' ? 'active' : ''}`}
        onClick={() => !active && setCurrentType('work')}
        disabled={active}
      >
        Praca
      </button>
      <button
        className={`type_button ${current_type === 'break' ? 'active' : ''}`}
        onClick={() => !active && setCurrentType('break')}
        disabled={active}
      >
        Przerwa
      </button>
      <button
        className={`type_button ${current_type === 'long_break' ? 'active' : ''}`}
        onClick={() => !active && setCurrentType('long_break')}
        disabled={active}
      >
        Długa przerwa
      </button>
    </div>
  );
};

export { TimerType };
