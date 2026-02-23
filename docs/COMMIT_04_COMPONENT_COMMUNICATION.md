# COMMIT 04: Component Communication

## 📦 What Was Built

This commit implements parent-child component communication using `@Input()` and `@Output()` decorators. We added event handlers to `TaskItemComponent` that emit events to the parent `TaskListComponent`, and implemented a search filter using two-way binding with `[(ngModel)]`.

## 🎯 Topic Focus: Component Communication (05)

**Key Concepts Learned:**
- `@Input()` - Pass data from parent to child
- `@Output()` - Emit events from child to parent
- Event binding `(event)`
- Two-way binding `[(ngModel)]`
- Parent-child communication patterns

## 🔧 Changes Made

### 1. Enhanced TaskItemComponent with @Output()

**File**: `src/app/features/tasks/task-item/task-item.component.ts`

**Added Event Emitters:**
```typescript
@Output() deleteTask = new EventEmitter<string>();
@Output() editTask = new EventEmitter<Task>();
@Output() statusChange = new EventEmitter<{ taskId: string; newStatus: string }>();
```

**Event Handler Methods:**
```typescript
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
```

**Template with Event Binding:**
```html
<button (click)="onDelete()">Delete</button>
<button (click)="onEdit()">Edit</button>
<button (click)="onStatusChange(getNextStatus())">Change Status</button>
```

### 2. Updated TaskListComponent to Handle Events

**File**: `src/app/features/tasks/task-list/task-list.component.ts`

**Event Handler Methods:**
```typescript
onDeleteTask(taskId: string): void {
  const index = this.tasks.findIndex(task => task._id === taskId);
  if (index !== -1) {
    this.tasks.splice(index, 1);
    this.totalTasks = this.tasks.length;
  }
}

onEditTask(task: Task): void {
  console.log('Edit task:', task);
  // Will navigate to edit form in Step 7
}

onStatusChange(event: { taskId: string; newStatus: string }): void {
  const task = this.tasks.find(t => t._id === event.taskId);
  if (task) {
    task.status = event.newStatus as 'todo' | 'doing' | 'done';
  }
}
```

**Template with Event Binding:**
```html
<app-task-item 
  [task]="task"
  (deleteTask)="onDeleteTask($event)"
  (editTask)="onEditTask($event)"
  (statusChange)="onStatusChange($event)">
</app-task-item>
```

### 3. Added Search Filter with Two-Way Binding

**File**: `src/app/features/tasks/task-list/task-list.component.ts`

**Two-Way Binding Property:**
```typescript
searchTerm: string = '';

get filteredTasks(): Task[] {
  if (!this.searchTerm.trim()) {
    return this.tasks;
  }
  const term = this.searchTerm.toLowerCase();
  return this.tasks.filter(task => 
    task.title.toLowerCase().includes(term) ||
    task.description.toLowerCase().includes(term)
  );
}
```

**Template with [(ngModel)]:**
```html
<input 
  type="text" 
  [(ngModel)]="searchTerm"
  placeholder="Search by title or description...">
```

**Note:** Added `FormsModule` to imports for `[(ngModel)]` to work.

## 📚 Key Concepts Explained

### Data Flow in Angular Components

**Two Directions:**
1. **Parent → Child**: Using `@Input()` and property binding `[property]`
2. **Child → Parent**: Using `@Output()` and event binding `(event)`

### @Input() - Pass Data Down

**What is @Input()?**
- Decorator that marks a property as an input
- Allows parent component to pass data to child
- Data flows from parent to child (one-way)

**Syntax:**
```typescript
@Input() propertyName: Type;
```

**Our Example:**
```typescript
// Child Component (TaskItemComponent)
@Input() task!: Task;
@Input() taskIndex: number = 0;
```

```html
<!-- Parent Component Template (TaskListComponent) -->
<app-task-item 
  [task]="task"
  [taskIndex]="i">
</app-task-item>
```

**How it works:**
1. Parent has data: `task` variable
2. Parent passes to child: `[task]="task"` (property binding)
3. Child receives: `@Input() task!: Task;`
4. Child can use: `{{ task.title }}` in template

**Property Binding Syntax:**
- `[property]="value"` - One-way binding (parent → child)
- Square brackets `[]` indicate property binding
- Value can be: variable, expression, method call

**Examples:**
```html
<!-- Pass string -->
<app-child [title]="'Hello'"></app-child>

<!-- Pass variable -->
<app-child [task]="currentTask"></app-child>

<!-- Pass expression -->
<app-child [count]="items.length"></app-child>

<!-- Pass method result -->
<app-child [data]="getData()"></app-child>
```

### @Output() - Emit Events Up

**What is @Output()?**
- Decorator that marks a property as an output
- Allows child component to emit events to parent
- Events flow from child to parent (one-way)

**Syntax:**
```typescript
@Output() eventName = new EventEmitter<DataType>();
```

**Our Example:**
```typescript
// Child Component (TaskItemComponent)
@Output() deleteTask = new EventEmitter<string>();

onDelete(): void {
  this.deleteTask.emit(this.task._id);
}
```

```html
<!-- Parent Component Template (TaskListComponent) -->
<app-task-item 
  (deleteTask)="onDeleteTask($event)">
</app-task-item>
```

**How it works:**
1. Child creates EventEmitter: `@Output() deleteTask = new EventEmitter<string>();`
2. Child emits event: `this.deleteTask.emit(taskId);`
3. Parent listens: `(deleteTask)="onDeleteTask($event)"`
4. Parent handles: `onDeleteTask(taskId: string) { ... }`

**Event Binding Syntax:**
- `(event)="handler($event)"` - Event binding
- Parentheses `()` indicate event binding
- `$event` contains the emitted data

**Examples:**
```html
<!-- Simple event -->
<app-child (click)="handleClick()"></app-child>

<!-- Event with data -->
<app-child (delete)="handleDelete($event)"></app-child>

<!-- Inline handler -->
<app-child (update)="item = $event"></app-child>
```

**EventEmitter Methods:**
```typescript
// Create emitter
@Output() myEvent = new EventEmitter<string>();

// Emit value
this.myEvent.emit('some value');

// Emit object
this.myEvent.emit({ id: 1, name: 'Task' });
```

### Two-Way Binding with [(ngModel)]

**What is two-way binding?**
- Combines property binding and event binding
- Data flows both ways: component ↔ template
- Changes in template update component, and vice versa

**Syntax:**
```html
<input [(ngModel)]="propertyName">
```

**This is shorthand for:**
```html
<input 
  [value]="propertyName"
  (input)="propertyName = $event.target.value">
```

**Our Example:**
```typescript
// Component
searchTerm: string = '';
```

```html
<!-- Template -->
<input [(ngModel)]="searchTerm" placeholder="Search...">
<p>You typed: {{ searchTerm }}</p>
```

**How it works:**
1. User types in input → `searchTerm` updates
2. `searchTerm` changes → input value updates
3. Both stay in sync automatically

**Requirements:**
- Import `FormsModule` in component imports
- Use with form elements: `input`, `select`, `textarea`

**Example with Filter:**
```typescript
searchTerm: string = '';

get filteredItems(): Item[] {
  if (!this.searchTerm) return this.items;
  return this.items.filter(item => 
    item.name.includes(this.searchTerm)
  );
}
```

```html
<input [(ngModel)]="searchTerm">
<div *ngFor="let item of filteredItems">
  {{ item.name }}
</div>
```

### Complete Communication Flow

**Example: Delete Task**

1. **User clicks Delete button** in `TaskItemComponent`
   ```html
   <button (click)="onDelete()">Delete</button>
   ```

2. **Child emits event:**
   ```typescript
   onDelete(): void {
     this.deleteTask.emit(this.task._id);
   }
   ```

3. **Parent listens to event:**
   ```html
   <app-task-item (deleteTask)="onDeleteTask($event)">
   ```

4. **Parent handles event:**
   ```typescript
   onDeleteTask(taskId: string): void {
     // Remove task from array
     this.tasks = this.tasks.filter(t => t._id !== taskId);
   }
   ```

**Data Flow Diagram:**
```
User Action (Click)
    ↓
Child Component (TaskItemComponent)
    ↓ (emits event)
Parent Component (TaskListComponent)
    ↓ (updates data)
UI Updates (tasks list refreshes)
```

## 💡 Code Highlights

### TaskItemComponent - Emitting Events

```typescript
export class TaskItemComponent {
  @Input() task!: Task;
  
  @Output() deleteTask = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() statusChange = new EventEmitter<{ taskId: string; newStatus: string }>();
  
  onDelete(): void {
    this.deleteTask.emit(this.task._id);
  }
  
  onEdit(): void {
    this.editTask.emit(this.task);
  }
  
  onStatusChange(newStatus: 'todo' | 'doing' | 'done'): void {
    this.statusChange.emit({
      taskId: this.task._id!,
      newStatus: newStatus
    });
  }
}
```

**Key Points:**
- `@Input()` receives data from parent
- `@Output()` creates event emitters
- `EventEmitter.emit()` sends data to parent
- Each event can carry different data types

### TaskListComponent - Handling Events

```typescript
export class TaskListComponent {
  tasks: Task[] = [...];
  searchTerm: string = '';
  
  onDeleteTask(taskId: string): void {
    this.tasks = this.tasks.filter(t => t._id !== taskId);
  }
  
  onEditTask(task: Task): void {
    console.log('Edit:', task);
  }
  
  onStatusChange(event: { taskId: string; newStatus: string }): void {
    const task = this.tasks.find(t => t._id === event.taskId);
    if (task) {
      task.status = event.newStatus as 'todo' | 'doing' | 'done';
    }
  }
  
  get filteredTasks(): Task[] {
    if (!this.searchTerm.trim()) return this.tasks;
    const term = this.searchTerm.toLowerCase();
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term)
    );
  }
}
```

```html
<input [(ngModel)]="searchTerm">

<app-task-item 
  *ngFor="let task of filteredTasks"
  [task]="task"
  (deleteTask)="onDeleteTask($event)"
  (editTask)="onEditTask($event)"
  (statusChange)="onStatusChange($event)">
</app-task-item>
```

**Key Points:**
- `[task]="task"` - Pass data down (property binding)
- `(deleteTask)="onDeleteTask($event)"` - Listen to events (event binding)
- `[(ngModel)]="searchTerm"` - Two-way binding
- `$event` contains emitted data

## ✅ Build Verification

- ✅ Build succeeds: `npm run build`
- ✅ No TypeScript errors
- ✅ All event handlers working
- ✅ Two-way binding functional
- ✅ Search filter working
- ✅ FormsModule imported correctly

## 🚀 What's Next

**Next Step: STEP 5 - Services & Dependency Injection**

We'll learn about:
- Creating services with `@Injectable()`
- Dependency Injection (DI) in Angular
- Singleton services
- Moving business logic from components to services
- Providing services at different levels

**What we'll build:**
- `TaskService` - Business logic for tasks
- `AuthService` - Handle authentication state
- Inject services into components
- Move data logic from components to services

---

## 💡 Tips for Learning

1. **@Input() is one-way**: Data flows parent → child only
2. **@Output() is one-way**: Events flow child → parent only
3. **Two-way binding**: Combines both directions with `[(ngModel)]`
4. **EventEmitter**: Must be instantiated with `new EventEmitter<T>()`
5. **$event**: Contains the data emitted from child
6. **FormsModule**: Required for `[(ngModel)]` to work

## 🎓 Practice Exercises

Try these to reinforce learning:

1. Add a new `@Output()` event for task completion
2. Create a component that receives data via `@Input()` and displays it
3. Add a counter that increments when a button is clicked (use two-way binding)
4. Create a filter component that emits filter criteria to parent
5. Implement a "select all" feature using `@Input()` and `@Output()`

---

**Commit Message:**
```
feat(communication): implement @Input/@Output and two-way binding

- Add @Output() events to TaskItemComponent (delete, edit, statusChange)
- Implement event handlers in TaskListComponent
- Add search filter with two-way binding using [(ngModel)]
- Import FormsModule for ngModel support
- Add action buttons to TaskItemComponent
- Demonstrate parent-child communication patterns

Topic: Component Communication (05)
Build: ✅ Verified successful (899KB bundle)
```
