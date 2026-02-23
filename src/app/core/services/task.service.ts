import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task } from '../../shared/models/task.model';
import { ApiResponse, TasksResponse, TaskResponse } from '../../shared/models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  // Inject HttpClient via constructor
  constructor(private http: HttpClient) {}

  // Get all tasks - Returns Observable
  getAllTasks(): Observable<Task[]> {
    return this.http.get<TasksResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data.map(task => this.mapTaskFromApi(task));
        }
        throw new Error(response.error?.message || 'Failed to fetch tasks');
      }),
      catchError(this.handleError)
    );
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

  // Create new task - Returns Observable
  createTask(task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    const payload = {
      title: task.title,
      description: task.description || '',
      status: task.status,
      dueDate: task.dueDate || null
    };

    return this.http.post<TaskResponse>(this.apiUrl, payload).pipe(
      map(response => {
        if (response.success && response.data) {
          return this.mapTaskFromApi(response.data);
        }
        throw new Error(response.error?.message || 'Failed to create task');
      }),
      catchError(this.handleError)
    );
  }

  // Update existing task - Returns Observable
  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    const payload = {
      title: updates.title,
      description: updates.description,
      status: updates.status,
      dueDate: updates.dueDate
    };

    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, payload).pipe(
      map(response => {
        if (response.success && response.data) {
          return this.mapTaskFromApi(response.data);
        }
        throw new Error(response.error?.message || 'Failed to update task');
      }),
      catchError(this.handleError)
    );
  }

  // Delete task - Returns Observable
  deleteTask(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success) {
          return true;
        }
        throw new Error(response.error?.message || 'Failed to delete task');
      }),
      catchError(this.handleError)
    );
  }

  // Update task status - Returns Observable
  updateTaskStatus(id: string, newStatus: 'todo' | 'doing' | 'done'): Observable<Task> {
    return this.updateTask(id, { status: newStatus });
  }

  // Search tasks by term - Client-side search (can be moved to backend)
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
