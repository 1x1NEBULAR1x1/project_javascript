import { motion } from 'framer-motion';

interface ScheduleHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

/**
 * Komponent nagłówka harmonogramu z wyborem daty
 */
const ScheduleHeader = ({ selectedDate, onDateChange, onRefresh, isRefreshing }: ScheduleHeaderProps) => {
  // Obsługa zmiany daty
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value);
  };

  return (
    <div className="schedule-header">
      <h2>Harmonogram dzienny</h2>
      <div className="date-selector">
        <label htmlFor="date-select">Wybierz datę:</label>
        <input
          id="date-select"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <motion.button
          className="refresh-button"
          onClick={onRefresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Odświeżanie...' : 'Odśwież dane'}
        </motion.button>
      </div>
    </div>
  );
};

export default ScheduleHeader; 