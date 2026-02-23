# COMMIT 03: Directives - Control the UI

## 📦 What Was Built

This commit implements Angular directives to create dynamic, interactive UIs. We replaced hardcoded task displays with `*ngFor` loops, added conditional rendering with `*ngIf`, and applied dynamic styling with `[ngClass]`. We also created a reusable `TaskItemComponent` to display individual tasks.

## 🎯 Topic Focus: Directives (04)

**Key Concepts Learned:**
- Structural directives: `*ngIf`, `*ngFor`
- Attribute directives: `[ngClass]`
- Conditional rendering patterns
- List rendering with loops
- Dynamic CSS class binding

## 🔧 Changes Made

### 1. Enhanced TaskListComponent with Directives

**File**: `src/app/features/tasks/task-list/task-list.component.html`

**Before (Step 2):**
```html
<!-- Hardcoded task displays -->
<div class="task-item">
  <h3>{{ tasks[0].title }}</h3>
</div>
<div class="task-item">
  <h3>{{ tasks[1].title }}</h3>
</div>
```

**After (Step 3):**
```html
<!-- Dynamic loop with *ngFor -->
<app-task-item 
  *ngFor="let task of tasks; let i = index" 
  [task]="task"
  [taskIndex]="i">
</app-task-item>
```

**Key Changes:**
- Added `isLoading` property for loading state
- Added `hasTasks()` method for empty state check
- Used `*ngIf` for conditional rendering (loading, empty state)
- Used `*ngFor` to loop through tasks array
- Imported `TaskItemComponent` to display individual tasks

### 2. Created TaskItemComponent

**Files**: 
- `src/app/features/tasks/task-item/task-item.component.ts`
- `src/app/features/tasks/task-item/task-item.component.html`
- `src/app/features/tasks/task-item/task-item.component.css`

**Features:**
- Receives task data via `@Input()` (we'll learn this in Step 4)
- Uses `[ngClass]` to apply dynamic CSS classes based on status
- Uses `*ngIf` to conditionally show due date and overdue warnings
- Displays task information with proper styling

### 3. Dynamic Styling with [ngClass]

**Example from TaskItemComponent:**
```html
<div class="task-item" [ngClass]="getStatusClass()">
  <span class="task-status" [ngClass]="'status-badge-' + task.status">
    {{ task.status | uppercase }}
  </span>
</div>
```

**CSS Classes Applied:**
- `status-todo` - Gray border for todo tasks
- `status-doing` - Yellow border and background for in-progress tasks
- `status-done` - Green border and background for completed tasks

## 📚 Key Concepts Explained

### Structural Directives

**What are structural directives?**
- Directives that change the DOM structure by adding/removing elements
- Prefixed with `*` (asterisk)
- Most common: `*ngIf`, `*ngFor`, `*ngSwitch`

#### 1. *ngIf - Conditional Rendering

**Syntax:**
```html
<div *ngIf="condition">Content shown when condition is true</div>
```

**Examples from our code:**

**Loading State:**
```html
<div class="loading-container" *ngIf="isLoading">
  <p>Loading tasks...</p>
</div>
```

**Empty State:**
```html
<div class="empty-state" *ngIf="!hasTasks()">
  <p>No tasks found.</p>
</div>
```

**Conditional Date Display:**
```html
<span class="task-date" *ngIf="task.dueDate">
  Due: {{ task.dueDate | date:'shortDate' }}
</span>
```

**Key Points:**
- Element is completely removed from DOM when condition is false
- More efficient than CSS `display: none` (which keeps element in DOM)
- Can use `else` clause: `*ngIf="condition; else otherTemplate"`

**Truthy/Falsy Values:**
- `true`, non-empty strings, non-zero numbers → true
- `false`, `null`, `undefined`, `0`, `''` → false

#### 2. *ngFor - List Rendering

**Syntax:**
```html
<div *ngFor="let item of items; let i = index">
  {{ i }}: {{ item.name }}
</div>
```

**Our Example:**
```html
<app-task-item 
  *ngFor="let task of tasks; let i = index" 
  [task]="task"
  [taskIndex]="i">
</app-task-item>
```

**What happens:**
- Angular creates one `<app-task-item>` for each task in the `tasks` array
- `task` variable holds the current task in the loop
- `i` variable holds the current index (0, 1, 2, ...)

**Available Variables:**
- `let item of items` - Current item
- `let i = index` - Current index (0-based)
- `let first = first` - True if first item
- `let last = last` - True if last item
- `let even = even` - True if even index
- `let odd = odd` - True if odd index

**Example with more variables:**
```html
<div *ngFor="let task of tasks; let i = index; let first = first; let last = last">
  <p>Task {{ i + 1 }}: {{ task.title }}</p>
  <p *ngIf="first">This is the first task</p>
  <p *ngIf="last">This is the last task</p>
</div>
```

**TrackBy Function (Performance):**
```typescript
trackByTaskId(index: number, task: Task): string {
  return task._id || index;
}
```
```html
<div *ngFor="let task of tasks; trackBy: trackByTaskId">
```

### Attribute Directives

**What are attribute directives?**
- Directives that change the appearance or behavior of elements
- Applied with square brackets: `[directive]="value"`
- Most common: `[ngClass]`, `[ngStyle]`, `[ngModel]`

#### [ngClass] - Dynamic CSS Classes

**Syntax:**
```html
<div [ngClass]="expression">Content</div>
```

**Three Ways to Use [ngClass]:**

**1. String (Single Class):**
```html
<div [ngClass]="'my-class'">Content</div>
```

**2. Object (Multiple Classes with Conditions):**
```html
<div [ngClass]="{
  'active': isActive,
  'disabled': isDisabled,
  'highlight': isHighlighted
}">Content</div>
```
- Class is applied when property value is `true`
- Class is removed when property value is `false`

**3. Array (Multiple Classes):**
```html
<div [ngClass]="['class1', 'class2', condition ? 'class3' : 'class4']">
```

**Our Examples:**

**Method-based (TaskItemComponent):**
```typescript
getStatusClass(): string {
  return `status-${this.task.status}`;
}
```
```html
<div class="task-item" [ngClass]="getStatusClass()">
```

**String Concatenation:**
```html
<span [ngClass]="'status-badge-' + task.status">
  {{ task.status | uppercase }}
</span>
```

**Object-based Example (Alternative):**
```html
<div [ngClass]="{
  'status-todo': task.status === 'todo',
  'status-doing': task.status === 'doing',
  'status-done': task.status === 'done'
}">
```

### Combining Directives

**You can use multiple directives on the same element:**
```html
<div 
  *ngFor="let task of tasks" 
  [ngClass]="getStatusClass()"
  *ngIf="task.status !== 'done'">
  {{ task.title }}
</div>
```

**Note:** When using `*ngIf` and `*ngFor` together, Angular recommends using a wrapper element or `ng-container`:
```html
<ng-container *ngFor="let task of tasks">
  <div *ngIf="task.status !== 'done'">
    {{ task.title }}
  </div>
</ng-container>
```

## 💡 Code Highlights

### TaskListComponent - Multiple Directives

```html
<!-- Loading state with *ngIf -->
<div class="loading-container" *ngIf="isLoading">
  <p>Loading tasks...</p>
</div>

<!-- Tasks section with *ngIf -->
<div class="tasks-section" *ngIf="!isLoading">
  <!-- Empty state with *ngIf -->
  <div class="empty-state" *ngIf="!hasTasks()">
    <p>No tasks found.</p>
  </div>

  <!-- Task list with *ngFor -->
  <div class="tasks-grid" *ngIf="hasTasks()">
    <app-task-item 
      *ngFor="let task of tasks; let i = index" 
      [task]="task"
      [taskIndex]="i">
    </app-task-item>
  </div>
</div>
```

**Key Points:**
- `*ngIf="isLoading"` - Show loading when true
- `*ngIf="!isLoading"` - Show content when not loading
- `*ngIf="!hasTasks()"` - Show empty state when no tasks
- `*ngIf="hasTasks()"` - Show list when tasks exist
- `*ngFor="let task of tasks"` - Loop through tasks

### TaskItemComponent - Dynamic Styling

```typescript
getStatusClass(): string {
  return `status-${this.task.status}`;
}

isOverdue(): boolean {
  if (!this.task.dueDate) return false;
  const dueDate = new Date(this.task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today && this.task.status !== 'done';
}
```

```html
<div class="task-item" [ngClass]="getStatusClass()">
  <span class="task-status" [ngClass]="'status-badge-' + task.status">
    {{ task.status | uppercase }}
  </span>
  <span class="task-date" *ngIf="task.dueDate">
    Due: {{ task.dueDate | date:'shortDate' }}
  </span>
  <span class="overdue-warning" *ngIf="isOverdue()">
    ⚠️ Overdue
  </span>
</div>
```

**Key Points:**
- `[ngClass]="getStatusClass()"` - Method returns class name
- `[ngClass]="'status-badge-' + task.status"` - String concatenation
- `*ngIf="task.dueDate"` - Conditional rendering
- `*ngIf="isOverdue()"` - Method-based condition

## ✅ Build Verification

- ✅ Build succeeds: `npm run build`
- ✅ No TypeScript errors
- ✅ All directives working correctly
- ✅ Tasks display dynamically with `*ngFor`
- ✅ Conditional rendering works with `*ngIf`
- ✅ Dynamic styling applied with `[ngClass]`

## 🚀 What's Next

**Next Step: STEP 4 - Component Communication (@Input/@Output)**

We'll learn about:
- `@Input()` - Pass data from parent to child
- `@Output()` - Emit events from child to parent
- Event binding `(event)`
- Two-way binding `[(ngModel)]`
- Parent-child component communication patterns

**What we'll build:**
- Properly implement `@Input()` in `TaskItemComponent` (we used it but didn't explain it)
- Add `@Output()` to emit delete/edit events
- Handle events in `TaskListComponent`
- Create search filter with two-way binding

---

## 💡 Tips for Learning

1. **Directives are powerful**: They make templates dynamic and interactive
2. ***ngIf removes elements**: More efficient than CSS hiding
3. ***ngFor needs unique keys**: Use `trackBy` for better performance
4. **[ngClass] is flexible**: Can use strings, objects, or arrays
5. **Combine directives**: Use multiple directives for complex UIs

## 🎓 Practice Exercises

Try these to reinforce learning:

1. Add a filter to show only tasks with specific status using `*ngIf`
2. Use `*ngFor` with `let first = first` to add special styling to the first task
3. Create a method that returns an object for `[ngClass]` instead of a string
4. Add `*ngIf="task.description"` to only show description if it exists
5. Use `[ngClass]` with an object to apply multiple conditional classes

---

**Commit Message:**
```
feat(directives): implement *ngIf, *ngFor, and [ngClass] for dynamic UI

- Replace hardcoded task displays with *ngFor loop
- Add *ngIf for loading, empty states, and conditional rendering
- Implement [ngClass] for dynamic styling based on task status
- Create TaskItemComponent to display individual tasks
- Add overdue detection and conditional warnings

Topic: Directives (04)
Build: ✅ Verified successful (868KB bundle)
```
