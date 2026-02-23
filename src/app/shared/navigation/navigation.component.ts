import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {
  // Navigation items
  navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/tasks', label: 'Tasks', icon: '📋' }
  ];
  
  isAuthenticated = false;
  userEmail = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check authentication status
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userEmail = this.authService.getUserEmail();
    
    // Subscribe to auth state changes
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.userEmail = user?.email || '';
    });
  }

  logout(): void {
    this.authService.logout();
    // Navigation will update automatically via router
  }
}
