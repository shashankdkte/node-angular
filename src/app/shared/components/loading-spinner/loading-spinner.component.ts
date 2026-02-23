import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * LoadingSpinnerComponent - Reusable loading indicator
 * 
 * Displays a loading spinner that can be used throughout the application.
 * Can be shown inline or as an overlay.
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  // Optional: Custom message to display
  @Input() message: string = 'Loading...';
  
  // Optional: Size of spinner (small, medium, large)
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  // Optional: Show as overlay (full screen)
  @Input() overlay: boolean = false;
  
  // Optional: Inline spinner (for buttons, etc.)
  @Input() inline: boolean = false;
}
