import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Task } from '../shared/models/task.model';
import { TaskService } from '../core/services/task.service';

/**
 * TaskStateService - Centralized state management for tasks
 * 
 * This service uses BehaviorSubject to manage task state reactively.
 * Components subscribe to observables to get automatic updates when state changes.
 * 
 * Benefits:
 * - Single source of truth for task data
 * - Automatic UI updates across all components
 * - Optimistic updates for better UX
 * - Centralized state management
 */
@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  // Private BehaviorSubject to hold the current state
  // BehaviorSubject requires an initial value and emits current value to new subscribers
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  
  // Public observable that components can subscribe to
  // Using asObservable() prevents external code from calling next() directly
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  
  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  
  // Error state
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$: Observable<string | null> = this.errorSubject.asObservable();
  
  // Track if tasks have been loaded
  private initialized = false;

  constructor(private taskService: TaskService) {
    // Initialize state by loading tasks
    this.loadTasks();
  }

  /**
   * Get current tasks value synchronously
   * Useful when you need current value without subscribing
   */
  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  /**
   * Get task by ID from current state
   */
  getTaskById(id: string): Task | undefined {
    return this.tasksSubject.value.find(task => task._id === id);
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: 'todo' | 'doing' | 'done'): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }

  /**
   * Get task count by status
   */
  getTaskCountByStatus(status: string): Observable<number> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === status).length)
    );
  }

  /**
   * Get total task count
   */
  getTotalTaskCount(): Observable<number> {
    return this.tasks$.pipe(
      map(tasks => tasks.length)
    );
  }

  /**
   * Get task counts for all statuses
   */
  getTaskCounts(): Observable<{ todo: number; doing: number; done: number }> {
    return this.tasks$.pipe(
      map(tasks => ({
        todo: tasks.filter(t => t.status === 'todo').length,
        doing: tasks.filter(t => t.status === 'doing').length,
        done: tasks.filter(t => t.status === 'done').length
      }))
    );
  }

  /**
   * Load all tasks from API and update state
   */
  loadTasks(): void {
    if (this.loadingSubject.value) {
      // Already loading, don't make duplicate request
      return;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.taskService.getAllTasks().pipe(
      tap(tasks => {
        // Update state with loaded tasks
        this.tasksSubject.next(tasks);
        this.initialized = true;
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to load tasks');
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Create new task with optimistic update
   * Optimistic update: Update UI immediately, then sync with server
   */
  createTask(task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    // Create temporary task with temporary ID for optimistic update
    const tempTask: Task = {
      _id: `temp-${Date.now()}`,
      ...task,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Optimistic update: Add to state immediately
    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, tempTask]);
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Make API call
    return this.taskService.createTask(task).pipe(
      tap(newTask => {
        // Replace temporary task with real task from server
        const updatedTasks = this.tasksSubject.value.map(t =>
          t._id === tempTask._id ? newTask : t
        );
        this.tasksSubject.next(updatedTasks);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        // Rollback optimistic update on error
        const tasksWithoutTemp = this.tasksSubject.value.filter(
          t => t._id !== tempTask._id
        );
        this.tasksSubject.next(tasksWithoutTemp);
        this.errorSubject.next(error.message || 'Failed to create task');
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update existing task with optimistic update
   */
  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex(t => t._id === id);
    
    if (taskIndex === -1) {
      return throwError(() => new Error('Task not found in state'));
    }

    // Optimistic update: Update state immediately
    const originalTask = currentTasks[taskIndex];
    const optimisticTask: Task = {
      ...originalTask,
      ...updates,
      updatedAt: new Date()
    };

    const updatedTasks = [...currentTasks];
    updatedTasks[taskIndex] = optimisticTask;
    this.tasksSubject.next(updatedTasks);
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Make API call
    return this.taskService.updateTask(id, updates).pipe(
      tap(updatedTask => {
        // Replace optimistic update with real update from server
        const finalTasks = this.tasksSubject.value.map(t =>
          t._id === id ? updatedTask : t
        );
        this.tasksSubject.next(finalTasks);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        // Rollback optimistic update on error
        const rolledBackTasks = [...currentTasks];
        rolledBackTasks[taskIndex] = originalTask;
        this.tasksSubject.next(rolledBackTasks);
        this.errorSubject.next(error.message || 'Failed to update task');
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update task status (convenience method)
   */
  updateTaskStatus(id: string, newStatus: 'todo' | 'doing' | 'done'): Observable<Task> {
    return this.updateTask(id, { status: newStatus });
  }

  /**
   * Delete task with optimistic update
   */
  deleteTask(id: string): Observable<boolean> {
    const currentTasks = this.tasksSubject.value;
    const taskToDelete = currentTasks.find(t => t._id === id);
    
    if (!taskToDelete) {
      return throwError(() => new Error('Task not found in state'));
    }

    // Optimistic update: Remove from state immediately
    const tasksWithoutDeleted = currentTasks.filter(t => t._id !== id);
    this.tasksSubject.next(tasksWithoutDeleted);
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Make API call
    return this.taskService.deleteTask(id).pipe(
      tap(() => {
        // State already updated optimistically, just clear loading
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        // Rollback optimistic update on error
        this.tasksSubject.next(currentTasks);
        this.errorSubject.next(error.message || 'Failed to delete task');
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Search tasks (client-side filtering)
   */
  searchTasks(searchTerm: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => {
        if (!searchTerm.trim()) {
          return tasks;
        }
        const term = searchTerm.toLowerCase();
        return tasks.filter(task =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
        );
      })
    );
  }

  /**
   * Refresh tasks from server
   */
  refreshTasks(): void {
    this.initialized = false;
    this.loadTasks();
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
