const { readData, writeData, generateId } = require('./dbModel');

class Task {
  // Pobieranie wszystkich zadań
  static getAll() {
    const data = readData();
    return data.tasks;
  }
  
  // Pobieranie zadania po ID
  static getById(id) {
    const data = readData();
    return data.tasks.find(task => task.id === id);
  }
  
  // Tworzenie nowego zadania
  static create(taskData) {
    const data = readData();
    
    const newTask = {
      id: generateId('tasks'),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'do zrobienia',
      priority: taskData.priority || 'średni',
      createdAt: new Date().toISOString(),
      deadline: taskData.deadline || null
    };
    
    data.tasks.push(newTask);
    writeData(data);
    
    return newTask;
  }
  
  // Aktualizacja zadania
  static update(id, taskData) {
    const data = readData();
    const taskIndex = data.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return null;
    
    const updatedTask = {
      ...data.tasks[taskIndex],
      ...taskData,
      id
    };
    
    data.tasks[taskIndex] = updatedTask;
    writeData(data);
    
    return updatedTask;
  }
  
  // Usuwanie zadania
  static delete(id) {
    const data = readData();
    const taskIndex = data.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return false;
    
    data.tasks.splice(taskIndex, 1);
    writeData(data);
    
    return true;
  }
}

module.exports = Task; 