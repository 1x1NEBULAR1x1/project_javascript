import type { FC } from 'react';
import type { PomodoroSettings } from '../hooks/pomodoroApi';

interface ShowSettingsProps {
  settings: PomodoroSettings;
}

const ShowSettings: FC<ShowSettingsProps> = ({ settings }) => {
  return (
    <div className="settings_display">
      <div className="setting_item">
        <span>Czas pracy:</span>
        <span>{settings.work_duration} min</span>
      </div>
      <div className="setting_item">
        <span>Czas przerwy:</span>
        <span>{settings.break_duration} min</span>
      </div>
      <div className="setting_item">
        <span>Czas długiej przerwy:</span>
        <span>{settings.long_break_duration} min</span>
      </div>
      <div className="setting_item">
        <span>Interwał długiej przerwy:</span>
        <span>Co {settings.long_break_interval} cykli</span>
      </div>
    </div>
  );
};

export { ShowSettings };
