import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, ApiResponse } from '../../shared/models/api-response.model';

export interface User {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';
  
  // BehaviorSubject for reactive authentication state
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is authenticated on service initialization
    this.checkAuthStatus();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Login - Returns Observable
  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if (response.success && response.data) {
          const user: User = {
            id: response.data.user.id,
            email: response.data.user.email
          };
          
          // Store token and user
          this.setAuthData(response.data.token, user);
          return user;
        }
        throw new Error(response.error?.message || 'Login failed');
      }),
      catchError(this.handleError)
    );
  }

  // Register - Returns Observable
  register(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password }).pipe(
      map(response => {
        if (response.success && response.data) {
          const user: User = {
            id: response.data.user.id,
            email: response.data.user.email
          };
          
          // Store token and user
          this.setAuthData(response.data.token, user);
          return user;
        }
        throw new Error(response.error?.message || 'Registration failed');
      }),
      catchError(this.handleError)
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  // Get user email
  getUserEmail(): string {
    return this.getCurrentUser()?.email || '';
  }

  // Store authentication data
  private setAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Get stored user from localStorage
  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Check authentication status
  private checkAuthStatus(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this.currentUserSubject.next(user);
    } else {
      this.logout();
    }
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error?.error?.message) {
        errorMessage = error.error.error.message;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('Auth Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
