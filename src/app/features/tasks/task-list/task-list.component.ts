import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Task } from '../../../shared/models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  // Properties for display
  pageTitle = 'My Tasks';
  tasks: Task[] = [];
  totalTasks = 0;
  isLoading = false;
  
  // Two-way binding property for search filter
  searchTerm: string = '';
  
  // Dependency Injection: TaskService is injected via constructor
  // Angular automatically provides the service instance
  constructor(private taskService: TaskService) {
    // Services are injected here
    // 'private' keyword creates a class property automatically
  }
  
  // Lifecycle hook: Called after component initialization
  ngOnInit(): void {
    this.loadTasks();
    this.updateTaskCounts();
    // Initialize filtered tasks
    this.filteredTasks = this.tasks;
  }
  
  // Watch search term changes
  onSearchChange(): void {
    this.updateFilteredTasks();
  }
  
  // Load tasks from service - Now returns Observable
  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.totalTasks = tasks.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        alert('Failed to load tasks. Please try again.');
        this.isLoading = false;
      }
    });
  }
  
  // Filtered tasks based on search term - Now returns Observable
  filteredTasks: Task[] = [];
  
  // Update filtered tasks when search term changes
  updateFilteredTasks(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTasks = this.tasks;
      return;
    }
    
    this.taskService.searchTasks(this.searchTerm).subscribe({
      next: (tasks) => {
        this.filteredTasks = tasks;
      },
      error: (error) => {
        console.error('Error searching tasks:', error);
        this.filteredTasks = [];
      }
    });
  }
  
  // Method to get task count by status - Now returns Observable
  taskCounts: { [key: string]: number } = {
    todo: 0,
    doing: 0,
    done: 0
  };
  
  updateTaskCounts(): void {
    ['todo', 'doing', 'done'].forEach(status => {
      this.taskService.getTaskCountByStatus(status).subscribe({
        next: (count) => {
          this.taskCounts[status] = count;
        },
        error: (error) => {
          console.error(`Error getting count for ${status}:`, error);
        }
      });
    });
  }
  
  // Method to check if tasks array is empty
  hasTasks(): boolean {
    return this.tasks.length > 0;
  }
  
  // Event handlers - use service methods with Observables
  
  // Handle delete event from TaskItemComponent
  onDeleteTask(taskId: string): void {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    this.taskService.deleteTask(taskId).subscribe({
      next: (success) => {
        if (success) {
          // Reload tasks after deletion
          this.loadTasks();
          console.log(`Task ${taskId} deleted`);
        }
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    });
  }
  
  // Handle edit event from TaskItemComponent
  onEditTask(task: Task): void {
    console.log('Edit task:', task);
    // Navigation handled in TaskItemComponent
  }
  
  // Handle status change event from TaskItemComponent
  onStatusChange(event: { taskId: string; newStatus: string }): void {
    this.taskService.updateTaskStatus(
      event.taskId,
      event.newStatus as 'todo' | 'doing' | 'done'
    ).subscribe({
      next: (updatedTask) => {
        // Reload tasks after status update
        this.loadTasks();
        console.log(`Task ${event.taskId} status changed to ${event.newStatus}`);
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        alert('Failed to update task status. Please try again.');
      }
    });
  }
  
  // Clear search filter
  clearSearch(): void {
    this.searchTerm = '';
    this.updateFilteredTasks();
  }
}
