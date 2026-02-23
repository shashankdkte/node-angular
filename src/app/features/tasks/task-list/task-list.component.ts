import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../shared/models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent],
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
  }
  
  // Load tasks from service
  loadTasks(): void {
    this.isLoading = true;
    // Simulate async operation (in Step 8, this will be HTTP call)
    setTimeout(() => {
      this.tasks = this.taskService.getAllTasks();
      this.totalTasks = this.taskService.getTotalTaskCount();
      this.isLoading = false;
    }, 500);
  }
  
  // Filtered tasks based on search term - uses service method
  get filteredTasks(): Task[] {
    return this.taskService.searchTasks(this.searchTerm);
  }
  
  // Method to get task count by status - uses service method
  getTaskCountByStatus(status: string): number {
    return this.taskService.getTaskCountByStatus(status);
  }
  
  // Method to check if tasks array is empty
  hasTasks(): boolean {
    return this.tasks.length > 0;
  }
  
  // Event handlers - use service methods
  
  // Handle delete event from TaskItemComponent
  onDeleteTask(taskId: string): void {
    const deleted = this.taskService.deleteTask(taskId);
    if (deleted) {
      // Reload tasks after deletion
      this.tasks = this.taskService.getAllTasks();
      this.totalTasks = this.taskService.getTotalTaskCount();
      console.log(`Task ${taskId} deleted`);
    }
  }
  
  // Handle edit event from TaskItemComponent
  onEditTask(task: Task): void {
    console.log('Edit task:', task);
    // In Step 7, this will navigate to edit form
    alert(`Edit task: ${task.title}\n\nThis will open edit form in Step 7 (Forms)`);
  }
  
  // Handle status change event from TaskItemComponent
  onStatusChange(event: { taskId: string; newStatus: string }): void {
    const updated = this.taskService.updateTaskStatus(
      event.taskId,
      event.newStatus as 'todo' | 'doing' | 'done'
    );
    
    if (updated) {
      // Reload tasks after status update
      this.tasks = this.taskService.getAllTasks();
      console.log(`Task ${event.taskId} status changed to ${event.newStatus}`);
    }
  }
  
  // Clear search filter
  clearSearch(): void {
    this.searchTerm = '';
  }
}
