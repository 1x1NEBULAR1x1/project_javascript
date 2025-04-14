const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.json');

// Funkcja do odczytu danych z pliku JSON
const readData = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
      const defaultData = { tasks: [], schedule: [], pomodoro: { workDuration: 25, breakDuration: 5, longBreakDuration: 15, longBreakInterval: 4, sessions: [] } };
      writeData(defaultData);
      return defaultData;
    }
    console.error('Błąd podczas odczytu bazy danych:', error);
    throw error;
  }
};

// Funkcja do zapisu danych do pliku JSON
const writeData = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Błąd podczas zapisu do bazy danych:', error);
    throw error;
  }
};

// Funkcja do generowania unikalnego ID
const generateId = (collection) => {
  const data = readData();
  const items = data[collection] || [];
  
  if (items.length === 0) return "1";
  
  const ids = items.map(item => parseInt(item.id));
  const maxId = Math.max(...ids);
  return (maxId + 1).toString();
};

module.exports = {
  readData,
  writeData,
  generateId
}; 