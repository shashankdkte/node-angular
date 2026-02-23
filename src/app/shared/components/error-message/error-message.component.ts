import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ErrorMessageComponent - Reusable error display component
 * 
 * Displays error messages in a user-friendly way.
 * Can be dismissed and supports different error types.
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  // Error message to display
  @Input() message: string = '';
  
  // Error type (error, warning, info)
  @Input() type: 'error' | 'warning' | 'info' = 'error';
  
  // Show dismiss button
  @Input() dismissible: boolean = true;
  
  // Auto-dismiss after milliseconds (0 = no auto-dismiss)
  @Input() autoDismiss: number = 0;
  
  // Output event when dismissed
  @Output() dismissed = new EventEmitter<void>();
  
  visible: boolean = true;
  
  ngOnInit(): void {
    if (this.autoDismiss > 0) {
      setTimeout(() => {
        this.dismiss();
      }, this.autoDismiss);
    }
  }
  
  dismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }
  
  getIcon(): string {
    switch (this.type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  }
}
