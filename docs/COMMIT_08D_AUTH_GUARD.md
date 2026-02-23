# COMMIT 08D: Auth Guard - Route Protection

## 📦 What Was Built

This commit creates an authentication guard that protects routes requiring user authentication. Users must be logged in to access task-related pages. If not authenticated, they are automatically redirected to the login page.

## 🎯 Topic Focus: Route Guards (Advanced)

**Key Concepts Learned:**
- Route guards (`CanActivateFn`)
- Route protection
- Redirecting unauthenticated users
- Return URL handling
- Functional guards (Angular 17+)

## 🔧 Changes Made

### 1. Created AuthGuard

**File**: `src/app/core/guards/auth.guard.ts`

**Implementation:**
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Allow access
  }

  // Redirect to login with return URL
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false; // Deny access
};
```

**What it does:**
- Checks if user is authenticated
- Allows access if authenticated
- Redirects to login if not authenticated
- Stores attempted URL for redirect after login

### 2. Applied Guard to Protected Routes

**File**: `src/app/app.routes.ts`

**Protected Routes:**
```typescript
{
  path: 'tasks',
  component: TaskListComponent,
  canActivate: [authGuard] // Protected
},
{
  path: 'tasks/new',
  component: TaskFormComponent,
  canActivate: [authGuard] // Protected
},
{
  path: 'tasks/:id',
  component: TaskDetailComponent,
  canActivate: [authGuard] // Protected
},
{
  path: 'tasks/:id/edit',
  component: TaskFormComponent,
  canActivate: [authGuard] // Protected
}
```

**Public Routes:**
- `/` - Home (public)
- `/login` - Login (public)
- `/register` - Register (public)

### 3. Enhanced Login Component

**Added Return URL Handling:**
- Reads `returnUrl` from query parameters
- Redirects to original page after login
- Defaults to `/tasks` if no return URL

## 📚 Key Concepts Explained

### Route Guards

**What are route guards?**
- Functions that control route access
- Run before route is activated
- Can allow or deny access
- Can redirect users

**Types of Guards:**
- `CanActivate` - Can user access route?
- `CanActivateChild` - Can user access child routes?
- `CanDeactivate` - Can user leave route?
- `CanLoad` - Can module be loaded?
- `Resolve` - Resolve data before route loads

### CanActivateFn (Functional Guard)

**Angular 17+ Functional Guard:**
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  // Check authentication
  if (isAuthenticated()) {
    return true; // Allow
  }
  return false; // Deny
};
```

**Parameters:**
- `route` - Activated route snapshot
- `state` - Router state snapshot

**Return Values:**
- `true` - Allow access
- `false` - Deny access
- `UrlTree` - Redirect to URL

**Our Implementation:**
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect with return URL
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};
```

### Applying Guards to Routes

**Syntax:**
```typescript
{
  path: 'protected',
  component: ProtectedComponent,
  canActivate: [authGuard]
}
```

**Multiple Guards:**
```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, adminGuard] // Both must pass
}
```

**Our Routes:**
```typescript
{
  path: 'tasks',
  component: TaskListComponent,
  canActivate: [authGuard] // Single guard
}
```

### Return URL Pattern

**What is return URL?**
- URL user was trying to access
- Stored when redirecting to login
- Used to redirect back after login

**Flow:**
1. User tries to access `/tasks/:id`
2. Not authenticated → Guard redirects to `/login?returnUrl=/tasks/:id`
3. User logs in
4. Login component reads `returnUrl`
5. Redirects to `/tasks/:id` (original destination)

**Implementation:**
```typescript
// In Guard
router.navigate(['/login'], {
  queryParams: { returnUrl: state.url }
});

// In Login Component
const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tasks';
this.router.navigate([returnUrl]);
```

## 💡 Code Highlights

### Complete Guard Implementation

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};
```

**Key Points:**
- Uses `CanActivateFn` (functional guard)
- Uses `inject()` for dependency injection
- Checks authentication status
- Redirects with return URL
- Returns boolean

### Route Configuration

```typescript
export const routes: Routes = [
  { path: '', component: HomeComponent }, // Public
  { path: 'login', component: LoginComponent }, // Public
  { path: 'register', component: RegisterComponent }, // Public
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [authGuard] // Protected
  },
  {
    path: 'tasks/new',
    component: TaskFormComponent,
    canActivate: [authGuard] // Protected
  }
];
```

### Login with Return URL

```typescript
// In LoginComponent
this.authService.login(email, password).subscribe({
  next: (user) => {
    // Get return URL or default to /tasks
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tasks';
    this.router.navigate([returnUrl]);
  }
});
```

## ✅ How It Works

**Scenario 1: Authenticated User**
```
User navigates to /tasks
    ↓
Guard checks: isAuthenticated() = true
    ↓
Guard returns: true
    ↓
Route activates: TaskListComponent loads
```

**Scenario 2: Unauthenticated User**
```
User navigates to /tasks
    ↓
Guard checks: isAuthenticated() = false
    ↓
Guard redirects: /login?returnUrl=/tasks
    ↓
User logs in
    ↓
Login redirects: /tasks (original destination)
```

## ✅ Build Verification

- ✅ Build succeeds: `npm run build`
- ✅ No TypeScript errors
- ✅ Guard properly implemented
- ✅ Routes protected
- ✅ Return URL handling working

## 🚀 What's Next

**Next Step: STEP 9 - RxJS Essentials**

We'll learn about:
- More RxJS operators (switchMap, debounceTime, etc.)
- Using `async` pipe in templates
- Subscription management
- Combining multiple Observables
- Advanced Observable patterns

---

## 💡 Tips

1. **Guards are reusable**: Apply to multiple routes
2. **Order matters**: Guards run in order specified
3. **Return URL**: Improves user experience
4. **Functional guards**: Modern Angular 17+ approach
5. **Multiple guards**: Can chain multiple guards

---

**Commit Message:**
```
feat(guard): add auth guard to protect task routes

- Create authGuard functional guard
- Check authentication before route activation
- Redirect to login if not authenticated
- Store return URL for redirect after login
- Apply guard to all task-related routes
- Update LoginComponent to handle return URL

Topic: Route Guards
Build: ✅ Verified successful (1.88MB bundle)
```
