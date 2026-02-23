import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // Component properties - these can be used in templates with interpolation
  appName = 'Task Management App';
  welcomeMessage = 'Welcome to your task management system!';
  currentDate = new Date();
  taskCount = 0;
  userEmail = '';
  
  // Dependency Injection: Inject multiple services via constructor
  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {
    // Services are automatically injected by Angular
  }
  
  // Lifecycle hook: Called after component initialization
  ngOnInit(): void {
    // Use service methods to get data
    this.taskCount = this.taskService.getTotalTaskCount();
    this.userEmail = this.authService.getUserEmail();
    
    // If user is authenticated, show their email
    if (this.authService.isAuthenticated()) {
      this.welcomeMessage = `Welcome back, ${this.userEmail}!`;
    }
  }
  
  // Method that returns a value - can be used in templates
  getGreeting(): string {
    const hour = this.currentDate.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
