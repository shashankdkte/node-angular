import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../shared/models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  // @Input() will be explained in Step 4 (Component Communication)
  // For now, we're using it to receive task data from parent
  @Input() task!: Task;
  @Input() taskIndex: number = 0;
  
  // Method to get CSS class based on task status
  // Used with [ngClass] directive
  getStatusClass(): string {
    return `status-${this.task.status}`;
  }
  
  // Method to check if task is overdue
  isOverdue(): boolean {
    if (!this.task.dueDate) return false;
    const dueDate = new Date(this.task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && this.task.status !== 'done';
  }
}
