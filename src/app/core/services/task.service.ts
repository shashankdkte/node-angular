import { Injectable } from '@angular/core';
import { Task } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root' // Makes service available app-wide as singleton
})
export class TaskService {
  // Private property - tasks data
  // In Step 8, this will be replaced with HTTP calls to backend
  private tasks: Task[] = [
    {
      _id: '1',
      title: 'Learn Angular Basics',
      description: 'Understand components, templates, and data binding',
      status: 'doing',
      dueDate: new Date('2024-12-31')
    },
    {
      _id: '2',
      title: 'Build Task App',
      description: 'Create a complete task management application',
      status: 'todo',
      dueDate: new Date('2025-01-15')
    },
    {
      _id: '3',
      title: 'Master TypeScript',
      description: 'Learn advanced TypeScript features',
      status: 'done',
      dueDate: new Date('2024-12-01')
    }
  ];

  // Get all tasks
  getAllTasks(): Task[] {
    return [...this.tasks]; // Return copy to prevent direct mutation
  }

  // Get task by ID
  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task._id === id);
  }

  // Create new task
  createTask(task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      _id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.push(newTask);
    return newTask;
  }

  // Update existing task
  updateTask(id: string, updates: Partial<Task>): Task | null {
    const taskIndex = this.tasks.findIndex(task => task._id === id);
    if (taskIndex === -1) {
      return null;
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      _id: id, // Ensure ID doesn't change
      updatedAt: new Date()
    };

    return this.tasks[taskIndex];
  }

  // Delete task
  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex(task => task._id === id);
    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  // Update task status
  updateTaskStatus(id: string, newStatus: 'todo' | 'doing' | 'done'): Task | null {
    return this.updateTask(id, { status: newStatus });
  }

  // Search tasks by term
  searchTasks(searchTerm: string): Task[] {
    if (!searchTerm.trim()) {
      return this.getAllTasks();
    }

    const term = searchTerm.toLowerCase();
    return this.tasks.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term)
    );
  }

  // Get tasks by status
  getTasksByStatus(status: 'todo' | 'doing' | 'done'): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  // Get task count by status
  getTaskCountByStatus(status: string): number {
    return this.tasks.filter(task => task.status === status).length;
  }

  // Get total task count
  getTotalTaskCount(): number {
    return this.tasks.length;
  }

  // Private helper method to generate IDs
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
