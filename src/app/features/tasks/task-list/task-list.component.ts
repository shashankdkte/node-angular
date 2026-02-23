import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../shared/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  // Component property - hardcoded tasks for demonstration
  // In real app, this would come from a service
  tasks: Task[] = [
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
  
  // Properties for display
  pageTitle = 'My Tasks';
  totalTasks = this.tasks.length;
  
  // Method to get task count by status
  getTaskCountByStatus(status: string): number {
    return this.tasks.filter(task => task.status === status).length;
  }
}
