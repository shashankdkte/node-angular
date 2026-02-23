import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskStateService } from '../../../state/task-state.service';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../shared/models/task.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    ErrorMessageComponent
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  taskId: string | null = null;
  isLoading = false;
  error: string | null = null;
  showDeleteDialog = false;

  // Inject ActivatedRoute to get route parameters
  // Inject Router for navigation
  // Inject TaskStateService for state management
  // Inject TaskService as fallback for loading task
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskStateService: TaskStateService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    // Get route parameter using ActivatedRoute
    // Method 1: Using snapshot (for one-time access)
    // this.taskId = this.route.snapshot.paramMap.get('id');

    // Method 2: Using observable (for dynamic updates)
    // This is better when route params can change
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.loadTask(this.taskId);
      } else {
        this.error = 'Task ID not provided';
      }
    });
  }

  loadTask(id: string): void {
    this.isLoading = true;
    this.error = null;

    // First, try to get task from state (faster, no API call needed)
    const taskFromState = this.taskStateService.getTaskById(id);
    if (taskFromState) {
      this.task = taskFromState;
      this.isLoading = false;
      return;
    }

    // If not in state, load from API
    // This can happen if user navigates directly to detail URL
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.error = error.message || 'Task not found';
        this.isLoading = false;
      }
    });
  }

  // Navigate back to task list
  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  // Navigate to edit form
  editTask(): void {
    if (this.taskId) {
      this.router.navigate(['/tasks', this.taskId, 'edit']);
    }
  }

  // Delete task - show confirm dialog
  deleteTask(): void {
    if (!this.taskId) return;
    this.showDeleteDialog = true;
  }
  
  // Confirm delete action
  confirmDelete(): void {
    if (!this.taskId) return;
    
    const taskId = this.taskId;
    this.taskStateService.deleteTask(taskId).subscribe({
      next: (success) => {
        if (success) {
          // State is updated automatically, navigate to list
          this.router.navigate(['/tasks']);
        }
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.error = error.message || 'Failed to delete task. Please try again.';
        this.showDeleteDialog = false;
      }
    });
  }
  
  // Cancel delete action
  cancelDelete(): void {
    this.showDeleteDialog = false;
  }
}
