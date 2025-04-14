const { readData, writeData, generateId } = require('./dbModel');

class Pomodoro {
  // Pobieranie ustawień pomodoro
  static getSettings() {
    const data = readData();
    const { workDuration, breakDuration, longBreakDuration, longBreakInterval } = data.pomodoro;
    
    return {
      workDuration,
      breakDuration,
      longBreakDuration,
      longBreakInterval
    };
  }
  
  // Aktualizacja ustawień pomodoro
  static updateSettings(settingsData) {
    const data = readData();
    
    const updatedSettings = {
      ...data.pomodoro,
      workDuration: settingsData.workDuration || data.pomodoro.workDuration,
      breakDuration: settingsData.breakDuration || data.pomodoro.breakDuration,
      longBreakDuration: settingsData.longBreakDuration || data.pomodoro.longBreakDuration,
      longBreakInterval: settingsData.longBreakInterval || data.pomodoro.longBreakInterval
    };
    
    // Zachowywanie istniejących sesji
    updatedSettings.sessions = data.pomodoro.sessions;
    
    data.pomodoro = updatedSettings;
    writeData(data);
    
    return {
      workDuration: updatedSettings.workDuration,
      breakDuration: updatedSettings.breakDuration,
      longBreakDuration: updatedSettings.longBreakDuration,
      longBreakInterval: updatedSettings.longBreakInterval
    };
  }
  
  // Pobieranie wszystkich sesji
  static getAllSessions() {
    const data = readData();
    return data.pomodoro.sessions;
  }
  
  // Pobieranie sesji po dacie
  static getSessionsByDate(date) {
    const data = readData();
    return data.pomodoro.sessions.filter(session => session.date === date);
  }
  
  // Zapisywanie nowej sesji
  static saveSession(sessionData) {
    const data = readData();
    const { date, completedSessions, totalTime } = sessionData;
    
    const existingSessionIndex = data.pomodoro.sessions.findIndex(session => session.date === date);
    
    if (existingSessionIndex !== -1) {
      // Aktualizacja istniejącej sesji
      data.pomodoro.sessions[existingSessionIndex].completedSessions += completedSessions;
      data.pomodoro.sessions[existingSessionIndex].totalTime += totalTime;
      
      writeData(data);
      
      return data.pomodoro.sessions[existingSessionIndex];
    }
    
    // Tworzenie nowej sesji
    const newSession = {
      id: generateId('sessions'),
      date,
      completedSessions,
      totalTime
    };
    
    data.pomodoro.sessions.push(newSession);
    writeData(data);
    
    return newSession;
  }
}

module.exports = Pomodoro; 