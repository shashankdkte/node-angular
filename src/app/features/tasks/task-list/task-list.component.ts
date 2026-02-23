import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../shared/models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent],
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
  isLoading = false;
  
  // Two-way binding property for search filter
  // Used with [(ngModel)] directive
  searchTerm: string = '';
  
  // Filtered tasks based on search term
  get filteredTasks(): Task[] {
    if (!this.searchTerm.trim()) {
      return this.tasks;
    }
    const term = this.searchTerm.toLowerCase();
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term)
    );
  }
  
  // Method to get task count by status
  getTaskCountByStatus(status: string): number {
    return this.tasks.filter(task => task.status === status).length;
  }
  
  // Method to check if tasks array is empty
  hasTasks(): boolean {
    return this.tasks.length > 0;
  }
  
  // Event handlers - receive events from child components
  // These methods are called when child emits events
  
  // Handle delete event from TaskItemComponent
  onDeleteTask(taskId: string): void {
    const index = this.tasks.findIndex(task => task._id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.totalTasks = this.tasks.length;
      console.log(`Task ${taskId} deleted`);
    }
  }
  
  // Handle edit event from TaskItemComponent
  onEditTask(task: Task): void {
    console.log('Edit task:', task);
    // In a real app, this would navigate to edit form or open modal
    alert(`Edit task: ${task.title}\n\nThis will open edit form in Step 7 (Forms)`);
  }
  
  // Handle status change event from TaskItemComponent
  onStatusChange(event: { taskId: string; newStatus: string }): void {
    const task = this.tasks.find(t => t._id === event.taskId);
    if (task) {
      task.status = event.newStatus as 'todo' | 'doing' | 'done';
      console.log(`Task ${event.taskId} status changed to ${event.newStatus}`);
    }
  }
  
  // Clear search filter
  clearSearch(): void {
    this.searchTerm = '';
  }
}
