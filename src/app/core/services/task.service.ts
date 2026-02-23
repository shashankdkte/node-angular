import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, switchMap, debounceTime, distinctUntilChanged, shareReplay, finalize } from 'rxjs/operators';
import { Task } from '../../shared/models/task.model';
import { ApiResponse, TasksResponse, TaskResponse } from '../../shared/models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  // Loading state observable
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Cache for tasks list (shareReplay)
  private tasksCache$: Observable<Task[]> | null = null;

  // Inject HttpClient via constructor
  constructor(private http: HttpClient) {}

  // Get all tasks - Returns Observable with caching and loading state
  getAllTasks(): Observable<Task[]> {
    // Use cache if available (shareReplay pattern)
    if (!this.tasksCache$) {
      this.loadingSubject.next(true); // Set loading before request
      this.tasksCache$ = this.http.get<TasksResponse>(this.apiUrl).pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(task => this.mapTaskFromApi(task));
          }
          throw new Error(response.error?.message || 'Failed to fetch tasks');
        }),
        tap(() => this.loadingSubject.next(false)), // Side effect: clear loading on success
        catchError(error => {
          this.loadingSubject.next(false); // Clear loading on error
          return this.handleError(error);
        }),
        shareReplay(1) // Cache the result and share with multiple subscribers
      );
    }
    return this.tasksCache$;
  }

  // Clear cache (useful after create/update/delete)
  clearCache(): void {
    this.tasksCache$ = null;
  }

  // Get task by ID - Returns Observable
  getTaskById(id: string): Observable<Task> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return this.mapTaskFromApi(response.data);
        }
        throw new Error(response.error?.message || 'Task not found');
      }),
      catchError(this.handleError)
    );
  }

  // Create new task - Returns Observable with cache invalidation
  createTask(task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    const payload = {
      title: task.title,
      description: task.description || '',
      status: task.status,
      dueDate: task.dueDate || null
    };

    this.loadingSubject.next(true); // Set loading before request
    return this.http.post<TaskResponse>(this.apiUrl, payload).pipe(
      map(response => {
        if (response.success && response.data) {
          return this.mapTaskFromApi(response.data);
        }
        throw new Error(response.error?.message || 'Failed to create task');
      }),
      tap(() => {
        this.clearCache(); // Clear cache after create
      }),
      finalize(() => {
        this.loadingSubject.next(false); // Clear loading in finalize (always runs)
      }),
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  // Update existing task - Returns Observable with cache invalidation
  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    const payload = {
      title: updates.title,
      description: updates.description,
      status: updates.status,
      dueDate: updates.dueDate
    };

    this.loadingSubject.next(true); // Set loading before request
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, payload).pipe(
      map(response => {
        if (response.success && response.data) {
          return this.mapTaskFromApi(response.data);
        }
        throw new Error(response.error?.message || 'Failed to update task');
      }),
      tap(() => {
        this.clearCache(); // Clear cache after update
      }),
      finalize(() => {
        this.loadingSubject.next(false); // Clear loading in finalize (always runs)
      }),
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  // Delete task - Returns Observable with cache invalidation
  deleteTask(id: string): Observable<boolean> {
    this.loadingSubject.next(true); // Set loading before request
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success) {
          return true;
        }
        throw new Error(response.error?.message || 'Failed to delete task');
      }),
      tap(() => {
        this.clearCache(); // Clear cache after delete
      }),
      finalize(() => {
        this.loadingSubject.next(false); // Clear loading in finalize (always runs)
      }),
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  // Update task status - Returns Observable
  updateTaskStatus(id: string, newStatus: 'todo' | 'doing' | 'done'): Observable<Task> {
    return this.updateTask(id, { status: newStatus });
  }

  // Search tasks by term with debounce - Returns Observable
  // Use this method for reactive search with debouncing
  searchTasksReactive(searchTerm$: Observable<string>): Observable<Task[]> {
    return searchTerm$.pipe(
      debounceTime(300), // Wait 300ms after user stops typing
      distinctUntilChanged(), // Only emit if value changed
      switchMap(term => {
        // switchMap cancels previous search if new one comes in
        if (!term.trim()) {
          return this.getAllTasks();
        }
        return this.getAllTasks().pipe(
          map(tasks => {
            const lowerTerm = term.toLowerCase();
            return tasks.filter(task =>
              task.title.toLowerCase().includes(lowerTerm) ||
              task.description.toLowerCase().includes(lowerTerm)
            );
          })
        );
      })
    );
  }

  // Search tasks by term - Client-side search (can be moved to backend)
  // Kept for backward compatibility
  searchTasks(searchTerm: string): Observable<Task[]> {
    return this.getAllTasks().pipe(
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

  // Get tasks by status - Client-side filter
  getTasksByStatus(status: 'todo' | 'doing' | 'done'): Observable<Task[]> {
    return this.getAllTasks().pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }

  // Get task count by status
  getTaskCountByStatus(status: string): Observable<number> {
    return this.getAllTasks().pipe(
      map(tasks => tasks.filter(task => task.status === status).length)
    );
  }

  // Get total task count
  getTotalTaskCount(): Observable<number> {
    return this.getAllTasks().pipe(
      map(tasks => tasks.length)
    );
  }

  // Map API response to Task model
  private mapTaskFromApi(apiTask: any): Task {
    return {
      _id: apiTask._id,
      title: apiTask.title,
      description: apiTask.description || '',
      status: apiTask.status,
      dueDate: apiTask.dueDate ? new Date(apiTask.dueDate) : null,
      createdAt: apiTask.createdAt ? new Date(apiTask.createdAt) : undefined,
      updatedAt: apiTask.updatedAt ? new Date(apiTask.updatedAt) : undefined
    };
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error?.error?.message) {
        errorMessage = error.error.error.message;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('HTTP Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
