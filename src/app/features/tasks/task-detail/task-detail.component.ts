import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../shared/models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  taskId: string | null = null;
  isLoading = false;
  error: string | null = null;

  // Inject ActivatedRoute to get route parameters
  // Inject Router for navigation
  // Inject TaskService to get task data
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    // Get route parameter using ActivatedRoute
    // Method 1: Using snapshot (for one-time access)
    // this.taskId = this.route.snapshot.paramMap.get('id');

    // Method 2: Using observable (for dynamic updates)
    // This is better when route params can change
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.loadTask(this.taskId);
      } else {
        this.error = 'Task ID not provided';
      }
    });
  }

  loadTask(id: string): void {
    this.isLoading = true;
    this.error = null;

    // Simulate async operation (in Step 8, this will be HTTP call)
    setTimeout(() => {
      const task = this.taskService.getTaskById(id);
      if (task) {
        this.task = task;
      } else {
        this.error = 'Task not found';
      }
      this.isLoading = false;
    }, 300);
  }

  // Navigate back to task list
  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  // Navigate to edit form
  editTask(): void {
    if (this.taskId) {
      this.router.navigate(['/tasks', this.taskId, 'edit']);
    }
  }

  // Delete task and navigate back
  deleteTask(): void {
    if (this.taskId && confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.taskId);
      this.router.navigate(['/tasks']);
    }
  }
}
