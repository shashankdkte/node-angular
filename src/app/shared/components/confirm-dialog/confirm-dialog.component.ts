import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ConfirmDialogComponent - Reusable confirmation dialog
 * 
 * A simple modal dialog for confirming actions like delete, etc.
 * Can be shown/hidden and emits events for user actions.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  // Dialog visibility
  @Input() visible: boolean = false;
  
  // Dialog title
  @Input() title: string = 'Confirm Action';
  
  // Dialog message
  @Input() message: string = 'Are you sure you want to perform this action?';
  
  // Confirm button text
  @Input() confirmText: string = 'Confirm';
  
  // Cancel button text
  @Input() cancelText: string = 'Cancel';
  
  // Confirm button style (danger for delete, primary for others)
  @Input() confirmType: 'primary' | 'danger' = 'primary';
  
  // Output events
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();
  
  onConfirm(): void {
    this.confirm.emit();
    this.close();
  }
  
  onCancel(): void {
    this.cancel.emit();
    this.close();
  }
  
  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
  
  // Close on backdrop click
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.onCancel();
    }
  }
}
