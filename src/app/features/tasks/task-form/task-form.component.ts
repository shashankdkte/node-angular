import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../shared/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  task: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    dueDate: null
  };
  
  isEditMode = false;
  taskId: string | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode by checking route
    // Route: /tasks/:id/edit
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taskId = id;
        this.loadTask(id);
      } else {
        // New task mode - route: /tasks/new
        this.isEditMode = false;
      }
    });
  }

  loadTask(id: string): void {
    this.isLoading = true;
    const task = this.taskService.getTaskById(id);
    if (task) {
      this.task = { ...task };
    }
    this.isLoading = false;
  }

  saveTask(): void {
    if (!this.task.title?.trim()) {
      alert('Title is required');
      return;
    }

    if (this.isEditMode && this.taskId) {
      // Update existing task
      const updated = this.taskService.updateTask(this.taskId, this.task);
      if (updated) {
        this.router.navigate(['/tasks', this.taskId]);
      }
    } else {
      // Create new task
      const newTask = this.taskService.createTask({
        title: this.task.title!,
        description: this.task.description || '',
        status: this.task.status || 'todo',
        dueDate: this.task.dueDate || null
      });
      this.router.navigate(['/tasks', newTask._id]);
    }
  }

  cancel(): void {
    if (this.isEditMode && this.taskId) {
      this.router.navigate(['/tasks', this.taskId]);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}
