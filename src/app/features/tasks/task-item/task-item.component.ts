import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  // @Input() - Receives data from parent component
  // Parent passes data using property binding: [task]="taskData"
  @Input() task!: Task;
  @Input() taskIndex: number = 0;
  
  // @Output() - Emits events to parent component
  // Parent listens using event binding: (deleteTask)="handleDelete($event)"
  @Output() deleteTask = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() statusChange = new EventEmitter<{ taskId: string; newStatus: string }>();
  
  // Method to get CSS class based on task status
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
  
  // Event handler methods - emit events to parent
  onDelete(): void {
    if (this.task._id) {
      this.deleteTask.emit(this.task._id);
    }
  }
  
  onEdit(): void {
    this.editTask.emit(this.task);
  }
  
  onStatusChange(newStatus: 'todo' | 'doing' | 'done'): void {
    if (this.task._id) {
      this.statusChange.emit({
        taskId: this.task._id,
        newStatus: newStatus
      });
    }
  }
  
  // Get next status for status cycling
  getNextStatus(): 'todo' | 'doing' | 'done' {
    const statusOrder: ('todo' | 'doing' | 'done')[] = ['todo', 'doing', 'done'];
    const currentIndex = statusOrder.indexOf(this.task.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  }
}
