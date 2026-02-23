import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Task } from '../../../shared/models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../../../core/services/task.service';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, startWith, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TaskItemComponent],
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
  
  // Subject for unsubscribing (takeUntil pattern)
  private destroy$ = new Subject<void>();
  
  // Dependency Injection: TaskService is injected via constructor
  // Angular automatically provides the service instance
  constructor(private taskService: TaskService) {
    // Services are injected here
    // 'private' keyword creates a class property automatically
    
    // Initialize observables using RxJS operators
    this.tasks$ = this.taskService.getAllTasks();
    
    // Create loading observable
    this.isLoading$ = this.taskService.loading$;
    
    // Create filtered tasks observable with debounced search
    // Use the reactive search method which handles debouncing internally
    this.filteredTasks$ = this.taskService.searchTasksReactive(
      this.searchTerm$.pipe(startWith(''))
    );
    
    // Create total tasks count observable
    this.totalTasks$ = this.tasks$.pipe(
      map(tasks => tasks.length)
    );
    
    // Create task counts observable using combineLatest
    this.taskCounts$ = combineLatest([
      this.taskService.getTaskCountByStatus('todo'),
      this.taskService.getTaskCountByStatus('doing'),
      this.taskService.getTaskCountByStatus('done')
    ]).pipe(
      map(([todo, doing, done]) => ({ todo, doing, done }))
    );
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
  onDeleteTask(taskId: string): void {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    this.taskService.deleteTask(taskId).pipe(
      takeUntil(this.destroy$) // Auto-unsubscribe when component destroys
    ).subscribe({
      next: (success) => {
        if (success) {
          // Cache is cleared automatically, tasks$ will update
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
    ).pipe(
      takeUntil(this.destroy$) // Auto-unsubscribe when component destroys
    ).subscribe({
      next: (updatedTask) => {
        // Cache is cleared automatically, tasks$ will update
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
    this.searchTermSubject.next(''); // Update the subject
  }
}
