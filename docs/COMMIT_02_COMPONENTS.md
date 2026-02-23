# COMMIT 02: Core Concepts & Basic Components

## 📦 What Was Built

This commit introduces the core Angular concepts: components, templates, and template interpolation. We created two feature components (`HomeComponent` and `TaskListComponent`) that demonstrate how to display data using interpolation syntax.

## 📊 Visual Overview

```mermaid
graph TD
    A[Component.ts<br/>Properties & Methods] -->|Data| B[Component.html<br/>Template]
    B -->|Display| C[{{ property }}<br/>Interpolation]
    C -->|Transform| D[Pipe<br/>date, uppercase]
    D -->|Show| E[User Sees Data]
    
    style A fill:#2196F3,color:#fff
    style B fill:#4CAF50,color:#fff
    style C fill:#FF9800,color:#fff
    style D fill:#9C27B0,color:#fff
    style E fill:#E91E63,color:#fff
```

**What This Commit Teaches:**
- Component = TypeScript + HTML + CSS
- Interpolation `{{ }}` = Display data
- Pipes = Transform data

## 🎯 Topic Focus: Angular Core Concepts (02) + Basic Syntax (03)

**Key Concepts Learned:**
- Component structure (TypeScript, HTML, CSS files)
- Template interpolation (`{{ }}`)
- Component properties and methods
- Built-in pipes (date pipe)
- Basic routing setup

## 🔧 Changes Made

### 1. Created Task Model
**File**: `src/app/shared/models/task.model.ts`
```typescript
export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  dueDate?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
```

- TypeScript interface to define Task structure
- Ensures type safety throughout the application
- Shared model used by multiple components

### 2. Created HomeComponent
**Files**: 
- `src/app/features/home/home.component.ts`
- `src/app/features/home/home.component.html`
- `src/app/features/home/home.component.css`

**Component Properties:**
```typescript
appName = 'Task Management App';
welcomeMessage = 'Welcome to your task management system!';
currentDate = new Date();
taskCount = 0;
```

**Template Interpolation Examples:**
```html
<h1>{{ appName }}</h1>
<p>{{ getGreeting() }}, welcome!</p>
<p>Today is: <strong>{{ currentDate | date:'fullDate' }}</strong></p>
```

**What we learned:**
- Component properties can be displayed using `{{ propertyName }}`
- Methods can be called: `{{ methodName() }}`
- Pipes can transform data: `{{ date | date:'format' }}`

### 3. Enhanced TaskListComponent
**Files**: Updated existing component files

**Component Properties:**
```typescript
tasks: Task[] = [ /* hardcoded tasks */ ];
pageTitle = 'My Tasks';
totalTasks = this.tasks.length;
```

**Template Examples:**
```html
<h1>{{ pageTitle }}</h1>
<p>Total: <strong>{{ totalTasks }}</strong> tasks</p>
<h3>{{ tasks[0].title }}</h3>
<p>{{ tasks[0].description }}</p>
```

**What we learned:**
- Accessing array elements: `{{ array[index].property }}`
- Calling methods with parameters: `{{ getTaskCountByStatus('todo') }}`
- Displaying multiple properties from the same object

### 4. Updated Routing
**File**: `src/app/app.routes.ts`
```typescript
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent }
];
```

- Configured basic routing
- Home page at `/`
- Tasks page at `/tasks`

## 📚 Key Concepts Explained

### Component Structure

**Every Angular component has 3 files:**

1. **`.ts` (TypeScript)** - Component logic
   ```typescript
   @Component({
     selector: 'app-home',
     templateUrl: './home.component.html',
     styleUrls: ['./home.component.css']
   })
   export class HomeComponent {
     // Properties and methods go here
   }
   ```

2. **`.html` (Template)** - Component view
   ```html
   <div>
     <h1>{{ title }}</h1>
   </div>
   ```

3. **`.css` (Styles)** - Component styling
   ```css
   h1 {
     color: blue;
   }
   ```

### Template Interpolation

**What is interpolation?**
- Syntax: `{{ expression }}`
- Displays component data in the template
- Angular evaluates the expression and converts it to a string

**Examples:**

1. **Simple property:**
   ```typescript
   // Component
   name = 'John';
   ```
   ```html
   <!-- Template -->
   <p>Hello, {{ name }}</p>
   <!-- Output: Hello, John -->
   ```

2. **Method call:**
   ```typescript
   // Component
   getFullName(): string {
     return 'John Doe';
   }
   ```
   ```html
   <!-- Template -->
   <p>{{ getFullName() }}</p>
   <!-- Output: John Doe -->
   ```

3. **Mathematical expressions:**
   ```typescript
   count = 5;
   ```
   ```html
   <p>Total: {{ count + 1 }}</p>
   <!-- Output: Total: 6 -->
   ```

4. **Object properties:**
   ```typescript
   task = { title: 'Learn Angular', status: 'todo' };
   ```
   ```html
   <p>{{ task.title }} - {{ task.status }}</p>
   <!-- Output: Learn Angular - todo -->
   ```

### Built-in Pipes

**What are pipes?**
- Transform data for display
- Syntax: `{{ value | pipeName:parameter }}`
- Angular provides many built-in pipes

**Date Pipe Examples:**
```html
{{ currentDate | date }}                    <!-- Default format -->
{{ currentDate | date:'shortDate' }}        <!-- 12/31/2024 -->
{{ currentDate | date:'fullDate' }}         <!-- Monday, December 31, 2024 -->
{{ currentDate | date:'shortTime' }}        <!-- 3:45 PM -->
```

**Other common pipes:**
- `{{ text | uppercase }}` - Convert to uppercase
- `{{ text | lowercase }}` - Convert to lowercase
- `{{ price | currency }}` - Format as currency
- `{{ items | json }}` - Display as JSON

### Component Lifecycle (Brief Introduction)

**Angular components have a lifecycle:**
1. **Created** - Component class is instantiated
2. **Initialized** - `ngOnInit()` is called (if implemented)
3. **Rendered** - Template is displayed
4. **Updated** - When data changes, template updates
5. **Destroyed** - Component is removed from DOM

**We'll learn more about lifecycle hooks in later steps.**

## 💡 Code Highlights

### HomeComponent - Multiple Interpolation Examples

```typescript
export class HomeComponent {
  appName = 'Task Management App';
  currentDate = new Date();
  
  getGreeting(): string {
    const hour = this.currentDate.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
```

```html
<h1>{{ appName }}</h1>
<p>{{ getGreeting() }}, welcome!</p>
<p>Today is: {{ currentDate | date:'fullDate' }}</p>
```

**Key points:**
- Properties are accessed directly: `{{ appName }}`
- Methods are called with parentheses: `{{ getGreeting() }}`
- Pipes transform the output: `{{ currentDate | date:'fullDate' }}`

### TaskListComponent - Array Access

```typescript
tasks: Task[] = [
  { title: 'Learn Angular', status: 'todo' },
  { title: 'Build App', status: 'doing' }
];
```

```html
<h3>{{ tasks[0].title }}</h3>
<p>{{ tasks[0].description }}</p>
<p>Status: {{ tasks[0].status }}</p>
```

**Key points:**
- Access array elements by index: `tasks[0]`
- Chain property access: `tasks[0].title`
- Display multiple properties from same object

## ✅ Build Verification

- ✅ Build succeeds: `npm run build`
- ✅ No TypeScript errors
- ✅ All components render correctly
- ✅ Interpolation works for all data types
- ✅ Routing configured and working

## 🚀 What's Next

**Next Step: STEP 3 - Directives (*ngIf, *ngFor, [ngClass])**

We'll learn about:
- Structural directives: `*ngIf` for conditional rendering
- Structural directives: `*ngFor` for lists (we'll replace hardcoded task displays)
- Attribute directives: `[ngClass]` for dynamic styling
- Conditional rendering patterns

**What we'll build:**
- Use `*ngFor` to display all tasks dynamically
- Add `*ngIf` for empty states and loading
- Style tasks based on status using `[ngClass]`
- Create `TaskItemComponent` for individual task display

---

## 💡 Tips for Learning

1. **Interpolation is one-way**: Data flows from component → template
2. **Expressions are evaluated**: Angular runs the code inside `{{ }}`
3. **Pipes are pure functions**: They don't modify the original data
4. **Component properties**: Must be public (or at least accessible) to use in templates

---

## 🎓 Practice Exercises

Try these to reinforce learning:

1. Add a new property to `HomeComponent` and display it
2. Create a method that returns a formatted string and use it in the template
3. Add more tasks to `TaskListComponent` and display them
4. Try different date pipe formats
5. Experiment with mathematical expressions in interpolation

---

**Commit Message:**
```
feat(components): create basic components with templates and interpolation

- Create Task model interface
- Create HomeComponent with interpolation examples
- Enhance TaskListComponent with hardcoded tasks
- Configure basic routing (home and tasks routes)
- Demonstrate template interpolation, methods, and pipes

Topic: Angular Core Concepts (02) + Basic Syntax (03)
Build: ✅ Verified successful (854KB bundle)
```
