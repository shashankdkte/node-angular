import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DxTextBoxModule, DxButtonModule, DxValidatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DxTextBoxModule,
    DxButtonModule,
    DxValidatorModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tasks']);
    }
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Get form controls for easy access
  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  // Check if field has error
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  // Check if form has password mismatch error
  hasPasswordMismatch(): boolean {
    const hasMismatch = this.registerForm.hasError('passwordMismatch');
    const confirmPassword = this.registerForm.get('confirmPassword');
    const isDirtyOrTouched = confirmPassword?.dirty || confirmPassword?.touched;
    return !!(hasMismatch && isDirtyOrTouched);
  }

  // Get error message for field
  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    return 'Invalid value';
  }

  // Handle form submission
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { email, password } = this.registerForm.value;

    this.authService.register(email, password).subscribe({
      next: (user) => {
        console.log('Registration successful:', user);
        this.isLoading = false;
        // Redirect to tasks page
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.error = error.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Navigate to login page
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
