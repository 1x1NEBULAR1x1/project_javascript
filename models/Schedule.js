const { readData, writeData, generateId } = require('./dbModel');

class Schedule {
  // Pobieranie wszystkich harmonogramów
  static getAll() {
    const data = readData();
    return data.schedule;
  }
  
  // Pobieranie harmonogramu po dacie
  static getByDate(date) {
    const data = readData();
    return data.schedule.find(day => day.date === date);
  }
  
  // Pobieranie harmonogramu po ID
  static getById(id) {
    const data = readData();
    return data.schedule.find(schedule => schedule.id === id);
  }
  
  // Tworzenie nowego harmonogramu
  static create(scheduleData) {
    const data = readData();
    const { date } = scheduleData;
    
    const existingScheduleIndex = data.schedule.findIndex(item => item.date === date);
    if (existingScheduleIndex !== -1) return null;
    
    const newSchedule = {
      id: generateId('schedule'),
      date,
      events: scheduleData.events || []
    };
    
    data.schedule.push(newSchedule);
    writeData(data);
    
    return newSchedule;
  }
  
  // Dodawanie wydarzenia do harmonogramu
  static addEvent(scheduleId, eventData) {
    const data = readData();
    const scheduleIndex = data.schedule.findIndex(item => item.id === scheduleId);
    
    if (scheduleIndex === -1) return null;
    
    const newEvent = {
      id: generateId('events'),
      title: eventData.title,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      description: eventData.description || ''
    };
    
    data.schedule[scheduleIndex].events.push(newEvent);
    writeData(data);
    
    return newEvent;
  }
  
  // Aktualizacja wydarzenia
  static updateEvent(scheduleId, eventId, eventData) {
    const data = readData();
    const scheduleIndex = data.schedule.findIndex(item => item.id === scheduleId);
    
    if (scheduleIndex === -1) return null;
    
    const eventIndex = data.schedule[scheduleIndex].events.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) return null;
    
    const updatedEvent = {
      ...data.schedule[scheduleIndex].events[eventIndex],
      ...eventData,
      id: eventId
    };
    
    data.schedule[scheduleIndex].events[eventIndex] = updatedEvent;
    writeData(data);
    
    return updatedEvent;
  }
  
  // Usuwanie wydarzenia
  static deleteEvent(scheduleId, eventId) {
    const data = readData();
    const scheduleIndex = data.schedule.findIndex(item => item.id === scheduleId);
    
    if (scheduleIndex === -1) return false;
    
    const eventIndex = data.schedule[scheduleIndex].events.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) return false;
    
    data.schedule[scheduleIndex].events.splice(eventIndex, 1);
    writeData(data);
    
    return true;
  }
}

module.exports = Schedule; 