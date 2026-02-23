import { Injectable } from '@angular/core';

export interface User {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root' // Makes service available app-wide as singleton
})
export class AuthService {
  // Private property - current user
  // In Step 8, this will be managed with JWT tokens from backend
  private currentUser: User | null = null;
  private isAuthenticatedFlag: boolean = false;

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedFlag;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Login (mock implementation - will use HTTP in Step 8)
  login(email: string, password: string): boolean {
    // Mock authentication - in real app, this would call backend API
    if (email && password) {
      this.currentUser = {
        id: '1',
        email: email
      };
      this.isAuthenticatedFlag = true;
      return true;
    }
    return false;
  }

  // Register (mock implementation - will use HTTP in Step 8)
  register(email: string, password: string): boolean {
    // Mock registration - in real app, this would call backend API
    if (email && password) {
      this.currentUser = {
        id: '1',
        email: email
      };
      this.isAuthenticatedFlag = true;
      return true;
    }
    return false;
  }

  // Logout
  logout(): void {
    this.currentUser = null;
    this.isAuthenticatedFlag = false;
  }

  // Get user email
  getUserEmail(): string {
    return this.currentUser?.email || '';
  }
}
