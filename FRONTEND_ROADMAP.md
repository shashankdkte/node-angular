# Frontend Development Roadmap - Task App Complete
## Step-by-Step Learning Path Following Angular Topics (00-13)

This roadmap builds the Task App frontend progressively, with each step building on the previous one. Each commit will be documented with explanations of the concepts learned.

---

## 📋 Overview

**Goal**: Build a complete Task Management App using Angular 17+ with DevExtreme UI library

**Approach**: 
- Each step focuses on one Angular topic
- Build succeeds before every commit
- Documentation created after each commit
- Components have all 3 files (`.ts`, `.html`, `.css`)
- Progressive learning from basics to advanced

---

## 🗺️ Step-by-Step Roadmap

### **STEP 1: Project Setup & DevExtreme Installation**
**Topic**: Setup and Installation (01)
**Commit**: `feat(setup): install DevExtreme and configure basic setup`

**What we'll learn:**
- Installing third-party libraries in Angular
- Configuring DevExtreme theme
- Basic project structure

**What we'll build:**
- Install `devextreme` and `devextreme-angular`
- Configure DevExtreme theme in `styles.css`
- Update `angular.json` if needed
- Create basic app layout with DevExtreme components

**Files to create/modify:**
- `package.json` (add DevExtreme dependencies)
- `src/styles.css` (import DevExtreme themes)
- `src/app/app.component.html` (basic DevExtreme layout)

**Next step**: Basic components and templates

---

### **STEP 2: Core Concepts & Basic Components**
**Topic**: Angular Core Concepts (02) + Basic Syntax (03)
**Commit**: `feat(components): create basic components with templates and interpolation`

**What we'll learn:**
- Component structure (TypeScript, HTML, CSS)
- Template interpolation (`{{ }}`)
- Property binding `[property]`
- Component lifecycle basics

**What we'll build:**
- `HomeComponent` - Welcome page with interpolation
- `TaskListComponent` - Display hardcoded tasks using interpolation
- Basic property binding examples

**Files to create:**
- `src/app/features/home/home.component.ts`
- `src/app/features/home/home.component.html`
- `src/app/features/home/home.component.css`
- Update `TaskListComponent` with hardcoded data

**Next step**: Directives for dynamic UI

---

### **STEP 3: Directives - Control the UI**
**Topic**: Directives (04)
**Commit**: `feat(directives): implement *ngIf, *ngFor, and [ngClass] for dynamic UI`

**What we'll learn:**
- Structural directives: `*ngIf`, `*ngFor`
- Attribute directives: `[ngClass]`, `[ngStyle]`
- Conditional rendering
- List rendering

**What we'll build:**
- Update `TaskListComponent` to use `*ngFor` for task list
- Add `*ngIf` for empty state and loading states
- Use `[ngClass]` to style tasks based on status (todo/doing/done)
- Create `TaskItemComponent` to display individual tasks

**Files to create/modify:**
- `src/app/features/tasks/task-item/task-item.component.ts`
- `src/app/features/tasks/task-item/task-item.component.html`
- `src/app/features/tasks/task-item/task-item.component.css`
- Update `TaskListComponent` with directives

**Next step**: Component communication

---

### **STEP 4: Component Communication**
**Topic**: Component Communication (05)
**Commit**: `feat(communication): implement parent-child communication with @Input and @Output`

**What we'll learn:**
- `@Input()` - Pass data from parent to child
- `@Output()` - Emit events from child to parent
- Event binding `(event)`
- Two-way binding `[(ngModel)]`

**What we'll build:**
- Pass task data from `TaskListComponent` to `TaskItemComponent` via `@Input`
- Emit delete/edit events from `TaskItemComponent` to parent via `@Output`
- Create a search filter with two-way binding
- Handle task status change events

**Files to modify:**
- `TaskItemComponent` - Add `@Input()` for task, `@Output()` for events
- `TaskListComponent` - Handle child events, pass data to children
- Add search filter with `[(ngModel)]`

**Next step**: Services and dependency injection

---

### **STEP 5: Services & Dependency Injection**
**Topic**: Services and Dependency Injection (06)
**Commit**: `feat(services): create TaskService and AuthService with dependency injection`

**What we'll learn:**
- Creating services with `@Injectable()`
- Dependency Injection (DI) in Angular
- Singleton services
- Providing services (root vs component level)

**What we'll build:**
- `TaskService` - Business logic for tasks (initially with mock data)
- `AuthService` - Handle authentication state
- Inject services into components
- Move data logic from components to services

**Files to create:**
- `src/app/core/services/task.service.ts`
- `src/app/core/services/auth.service.ts`
- Update components to use services

**Next step**: Routing for navigation

---

### **STEP 6: Routing - Multiple Pages in SPA**
**Topic**: Routing (07)
**Commit**: `feat(routing): setup routing with task list, detail, and form routes`

**What we'll learn:**
- Router configuration
- Route parameters (`:id`)
- Navigation with `routerLink` and `Router`
- Route guards basics
- Child routes

**What we'll build:**
- Configure routes: `/`, `/tasks`, `/tasks/:id`, `/tasks/new`, `/tasks/:id/edit`
- Create `TaskDetailComponent` for viewing single task
- Create `TaskFormComponent` for create/edit
- Navigation menu with DevExtreme components
- Use `ActivatedRoute` to get route parameters

**Files to create:**
- `src/app/features/tasks/task-detail/task-detail.component.ts/html/css`
- `src/app/features/tasks/task-form/task-form.component.ts/html/css`
- Update `app.routes.ts` with all routes
- Create navigation component

**Next step**: Forms for user input

---

### **STEP 7: Forms - User Input**
**Topic**: Forms (08)
**Commit**: `feat(forms): implement reactive forms with validation using DevExtreme form components`

**What we'll learn:**
- Reactive Forms (`FormBuilder`, `FormGroup`, `FormControl`)
- Form validation (required, minLength, custom validators)
- Form submission and error handling
- DevExtreme form components (dx-text-box, dx-select-box, etc.)

**What we'll build:**
- Complete `TaskFormComponent` with reactive forms
- Add validators for title (required, minLength)
- Use DevExtreme form components for better UI
- Handle form submission and validation errors
- Pre-populate form for edit mode

**Files to modify:**
- `TaskFormComponent` - Full reactive form implementation
- Add custom validators if needed
- Integrate with `TaskService`

**Next step**: HTTP and API calls

---

### **STEP 8: HTTP and APIs**
**Topic**: HTTP and APIs (09)
**Commit**: `feat(http): integrate HttpClient with backend API`

**What we'll learn:**
- `HttpClient` service
- Making GET, POST, PUT, DELETE requests
- Observables in HTTP
- Error handling
- Environment configuration

**What we'll build:**
- Update `TaskService` to use `HttpClient` instead of mock data
- Create `AuthService` methods for login/register
- Handle API responses and errors
- Configure API base URL in environment files
- Add loading states during API calls

**Files to create/modify:**
- `src/environments/environment.ts` - API configuration
- Update `TaskService` with HTTP methods
- Update `AuthService` with HTTP methods
- Add error handling

**Next step**: RxJS essentials

---

### **STEP 9: RxJS Essentials**
**Topic**: RxJS Essentials (10)
**Commit**: `feat(rxjs): implement RxJS operators for data transformation and async handling`

**What we'll learn:**
- Observables vs Promises
- RxJS operators: `map`, `catchError`, `tap`, `switchMap`, `debounceTime`
- Subscribing and unsubscribing
- `async` pipe in templates
- `BehaviorSubject` for state

**What we'll build:**
- Use RxJS operators in `TaskService` for data transformation
- Implement search with `debounceTime`
- Use `async` pipe in templates
- Handle errors with `catchError`
- Create loading observables

**Files to modify:**
- Update services with RxJS operators
- Use `async` pipe in components
- Add proper subscription management

**Next step**: State management

---

### **STEP 10: State Management**
**Topic**: State Management (11)
**Commit**: `feat(state): implement state management with BehaviorSubject and RxJS`

**What we'll learn:**
- State management patterns
- `BehaviorSubject` for reactive state
- Sharing state across components
- State updates and subscriptions

**What we'll build:**
- Create `TaskStateService` with `BehaviorSubject`
- Manage task list state centrally
- Update state on CRUD operations
- Components subscribe to state changes
- Optimistic updates

**Files to create:**
- `src/app/state/task-state.service.ts`
- Update components to use state service
- Integrate with `TaskService`

**Next step**: Interceptors and guards

---

### **STEP 11: HTTP Interceptors & Route Guards**
**Topic**: Advanced Features
**Commit**: `feat(interceptors): add auth interceptor and error interceptor with route guards`

**What we'll learn:**
- HTTP Interceptors
- Adding headers (Authorization token)
- Global error handling
- Route guards (`canActivate`)
- Protecting routes

**What we'll build:**
- `AuthInterceptor` - Add JWT token to requests
- `ErrorInterceptor` - Handle API errors globally
- `AuthGuard` - Protect routes requiring authentication
- Store token in service/localStorage
- Redirect to login if not authenticated

**Files to create:**
- `src/app/core/interceptors/auth.interceptor.ts`
- `src/app/core/interceptors/error.interceptor.ts`
- `src/app/core/guards/auth.guard.ts`
- Update `main.ts` to provide interceptors
- Update routes with guards

**Next step**: Styling with DevExtreme

---

### **STEP 12: Styling & UI with DevExtreme**
**Topic**: Styling and UI (12)
**Commit**: `feat(ui): enhance UI with DevExtreme components and styling`

**What we'll learn:**
- DevExtreme component library
- Theming and customization
- Responsive design
- Component styling best practices

**What we'll build:**
- Replace basic HTML with DevExtreme components:
  - `dx-data-grid` for task list
  - `dx-popup` for modals
  - `dx-button`, `dx-text-box`, `dx-select-box` in forms
  - `dx-toast` for notifications
- Apply DevExtreme themes
- Make UI responsive
- Add loading indicators
- Improve overall UX

**Files to modify:**
- All component templates - Use DevExtreme components
- Component styles - DevExtreme theming
- Add responsive breakpoints

**Next step**: Final polish and best practices

---

### **STEP 13: Best Practices & Final Polish**
**Topic**: Build, Deploy, and Best Practices (13)
**Commit**: `feat(polish): final improvements, error handling, and best practices`

**What we'll learn:**
- Error handling patterns
- Loading states
- Code organization
- Performance optimization
- Build and deployment

**What we'll build:**
- Global error handling component
- Loading spinner component
- Toast notifications for success/error
- Code cleanup and organization
- Optimize bundle size
- Add proper TypeScript types
- Final testing

**Files to create/modify:**
- Error handling components
- Loading components
- Final code review and optimization

---

## 📝 Documentation Structure

After each commit, create a documentation file:
- `docs/COMMIT_01_SETUP.md`
- `docs/COMMIT_02_COMPONENTS.md`
- `docs/COMMIT_03_DIRECTIVES.md`
- ... and so on

Each doc should include:
1. **What was built** - Summary of changes
2. **Topic focus** - Which Angular concept was learned
3. **Key concepts explained** - Simple explanation of the topic
4. **Code highlights** - Important code snippets
5. **What's next** - Preview of next step

---

## ✅ Build Verification

Before each commit:
1. Run `npm run build` - Must succeed
2. Run `npm start` - App must load without errors
3. Test the new features manually
4. Fix any TypeScript/linting errors

---

## 🎯 Success Criteria

- ✅ All components have `.ts`, `.html`, `.css` files
- ✅ Build succeeds before every commit
- ✅ Documentation created after each commit
- ✅ Each step builds on previous knowledge
- ✅ DevExtreme used for UI components
- ✅ Proper parent-child communication
- ✅ Services with dependency injection
- ✅ HTTP interceptors implemented
- ✅ Forms with validation
- ✅ RxJS patterns used correctly
- ✅ State management implemented
- ✅ Routing and guards working

---

## 🚀 Getting Started

1. Start with **STEP 1**: Install DevExtreme
2. Build and test before committing
3. Create documentation
4. Move to next step

Let's begin! 🎉
