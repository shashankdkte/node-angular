import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Component properties - these can be used in templates with interpolation
  appName = 'Task Management App';
  welcomeMessage = 'Welcome to your task management system!';
  currentDate = new Date();
  taskCount = 0;
  
  // Method that returns a value - can be used in templates
  getGreeting(): string {
    const hour = this.currentDate.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
