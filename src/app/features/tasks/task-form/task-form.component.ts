import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../shared/models/task.model';
import { DxTextBoxModule, DxTextAreaModule, DxSelectBoxModule, DxDateBoxModule, DxButtonModule, DxValidatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxValidatorModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  // Reactive Form Group
  taskForm!: FormGroup;
  
  isEditMode = false;
  taskId: string | null = null;
  isLoading = false;
  isSubmitting = false;

  // Status options for select box
  statusOptions = [
    { value: 'todo', label: 'Todo' },
    { value: 'doing', label: 'Doing' },
    { value: 'done', label: 'Done' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private fb: FormBuilder // FormBuilder for creating reactive forms
  ) {
    // Initialize form with FormBuilder
    this.initializeForm();
  }

  ngOnInit(): void {
    // Check if we're in edit mode by checking route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taskId = id;
        this.loadTask(id);
      } else {
        // New task mode
        this.isEditMode = false;
      }
    });
  }

  // Initialize reactive form with validators
  initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.maxLength(500)
      ]],
      status: ['todo', Validators.required],
      dueDate: [null]
    });
  }

  // Load task and populate form
  loadTask(id: string): void {
    this.isLoading = true;
    const task = this.taskService.getTaskById(id);
    if (task) {
      // Populate form with task data
      this.taskForm.patchValue({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate) : null
      });
    }
    this.isLoading = false;
  }

  // Get form controls for easy access in template
  get f(): { [key: string]: AbstractControl } {
    return this.taskForm.controls;
  }

  // Check if field has error
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.taskForm.get(fieldName);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  // Get error message for field
  getErrorMessage(fieldName: string): string {
    const control = this.taskForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    return 'Invalid value';
  }

  // Handle form submission
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    if (this.taskForm.invalid) {
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      // Update existing task
      const updated = this.taskService.updateTask(this.taskId, {
        title: formValue.title.trim(),
        description: formValue.description?.trim() || '',
        status: formValue.status,
        dueDate: formValue.dueDate || null
      });
      
      if (updated) {
        this.router.navigate(['/tasks', this.taskId]);
      }
    } else {
      // Create new task
      const newTask = this.taskService.createTask({
        title: formValue.title.trim(),
        description: formValue.description?.trim() || '',
        status: formValue.status,
        dueDate: formValue.dueDate || null
      });
      this.router.navigate(['/tasks', newTask._id]);
    }
    
    this.isSubmitting = false;
  }

  cancel(): void {
    if (this.isEditMode && this.taskId) {
      this.router.navigate(['/tasks', this.taskId]);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}
