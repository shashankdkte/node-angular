import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Task } from '../../../shared/models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskStateService } from '../../../state/task-state.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    TaskItemComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    ErrorMessageComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, OnDestroy {
  // Properties for display
  pageTitle = 'My Tasks';
  
  // Observable properties for use with async pipe
  tasks$: Observable<Task[]>;
  filteredTasks$: Observable<Task[]>;
  totalTasks$: Observable<number>;
  taskCounts$: Observable<{ todo: number; doing: number; done: number }>;
  isLoading$: Observable<boolean>;
  
  // Search term subject for reactive search
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  
  // Two-way binding property for search filter
  searchTerm: string = '';
  
  // Confirm dialog state
  showDeleteDialog = false;
  taskToDelete: string | null = null;
  
  // Error message
  errorMessage: string = '';
  
  // Subject for unsubscribing (takeUntil pattern)
  private destroy$ = new Subject<void>();
  
  // Dependency Injection: TaskStateService is injected via constructor
  // Angular automatically provides the service instance
  constructor(private taskStateService: TaskStateService) {
    // Services are injected here
    // 'private' keyword creates a class property automatically
    
    // Get observables from state service
    // State service manages all task data centrally
    this.tasks$ = this.taskStateService.tasks$;
    
    // Get loading state from state service
    this.isLoading$ = this.taskStateService.loading$;
    
    // Create filtered tasks observable with search
    // Combine tasks$ and searchTerm$ to react to both changes
    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.searchTerm$.pipe(startWith(''))
    ]).pipe(
      map(([tasks, searchTerm]) => {
        if (!searchTerm.trim()) {
          return tasks;
        }
        const lowerTerm = searchTerm.toLowerCase();
        return tasks.filter(task =>
          task.title.toLowerCase().includes(lowerTerm) ||
          task.description.toLowerCase().includes(lowerTerm)
        );
      })
    );
    
    // Get total tasks count from state service
    this.totalTasks$ = this.taskStateService.getTotalTaskCount();
    
    // Get task counts from state service
    this.taskCounts$ = this.taskStateService.getTaskCounts();
  }
  
  // Lifecycle hook: Called after component initialization
  ngOnInit(): void {
    // Subscribe to search term changes from template
    // This connects the two-way binding to the reactive search
  }
  
  // Lifecycle hook: Called when component is destroyed
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions using takeUntil pattern
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Watch search term changes - updates the subject
  onSearchChange(): void {
    this.searchTermSubject.next(this.searchTerm);
  }
  
  // Method to check if tasks array is empty - used in template
  // Note: In template, use async pipe with *ngIf="(tasks$ | async)?.length"
  hasTasks(tasks: Task[] | null): boolean {
    return tasks ? tasks.length > 0 : false;
  }
  
  // Event handlers - use service methods with Observables and proper subscription management
  
  // Handle delete event from TaskItemComponent
  // Show confirm dialog instead of native confirm
  onDeleteTask(taskId: string): void {
    this.taskToDelete = taskId;
    this.showDeleteDialog = true;
  }
  
  // Confirm delete action
  confirmDelete(): void {
    if (!this.taskToDelete) return;
    
    const taskId = this.taskToDelete;
    this.taskToDelete = null;
    
    this.taskStateService.deleteTask(taskId).pipe(
      takeUntil(this.destroy$) // Auto-unsubscribe when component destroys
    ).subscribe({
      next: (success) => {
        if (success) {
          // State is updated automatically via BehaviorSubject
          // UI updates reactively without manual refresh
          console.log(`Task ${taskId} deleted`);
        }
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.errorMessage = error.message || 'Failed to delete task. Please try again.';
      }
    });
  }
  
  // Cancel delete action
  cancelDelete(): void {
    this.taskToDelete = null;
    this.showDeleteDialog = false;
  }
  
  // Handle edit event from TaskItemComponent
  onEditTask(task: Task): void {
    console.log('Edit task:', task);
    // Navigation handled in TaskItemComponent
  }
  
  // Handle status change event from TaskItemComponent
  // State service handles optimistic updates automatically
  onStatusChange(event: { taskId: string; newStatus: string }): void {
    this.taskStateService.updateTaskStatus(
      event.taskId,
      event.newStatus as 'todo' | 'doing' | 'done'
    ).pipe(
      takeUntil(this.destroy$) // Auto-unsubscribe when component destroys
    ).subscribe({
      next: (updatedTask) => {
        // State is updated automatically via BehaviorSubject
        // UI updates reactively without manual refresh
        console.log(`Task ${event.taskId} status changed to ${event.newStatus}`);
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        this.errorMessage = error.message || 'Failed to update task status. Please try again.';
      }
    });
  }
  
  // Clear search filter
  clearSearch(): void {
    this.searchTerm = '';
    this.searchTermSubject.next(''); // Update the subject
  }
}
