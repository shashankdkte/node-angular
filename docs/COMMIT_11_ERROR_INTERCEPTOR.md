# COMMIT 11: Error Interceptor - Global HTTP Error Handling

## 📦 What Was Built

This commit creates a global HTTP error interceptor that catches all HTTP errors, maps them to user-friendly messages, and handles authentication errors automatically. This provides a consistent error handling experience across the entire application.

## 🎯 Topic Focus: HTTP Interceptors & Error Handling (Advanced)

**Key Concepts Learned:**
- Global error handling with interceptors
- HTTP error status codes
- User-friendly error messages
- Automatic authentication error handling
- Error logging and debugging

## 🔧 Changes Made

### 1. Created Error Interceptor

**File**: `src/app/core/interceptors/error.interceptor.ts`

#### Complete Implementation
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';
      
      // Handle different error types
      if (error.error instanceof ErrorEvent) {
        // Client-side error (network, CORS, etc.)
        errorMessage = `Network Error: ${error.error.message}`;
        console.error('Client-side error:', error.error);
      } else {
        // Server-side error
        const status = error.status;
        const errorBody = error.error;

        switch (status) {
          case 0:
            errorMessage = 'Unable to connect to server. Please check your internet connection.';
            break;
          
          case 400:
            errorMessage = errorBody?.error?.message || 
                          errorBody?.message || 
                          'Invalid request. Please check your input.';
            break;
          
          case 401:
            // Unauthorized - Token expired or invalid
            errorMessage = 'Your session has expired. Please login again.';
            authService.logout();
            router.navigate(['/login'], {
              queryParams: { returnUrl: router.url }
            });
            break;
          
          case 403:
            errorMessage = errorBody?.error?.message || 
                          errorBody?.message || 
                          'You do not have permission to perform this action.';
            break;
          
          case 404:
            errorMessage = errorBody?.error?.message || 
                          errorBody?.message || 
                          'The requested resource was not found.';
            break;
          
          case 500:
            errorMessage = 'Server error. Please try again later.';
            console.error('Server error:', errorBody);
            break;
          
          // ... more error codes
        }
      }

      // Create user-friendly error
      const userFriendlyError = new Error(errorMessage);
      (userFriendlyError as any).originalError = error;
      (userFriendlyError as any).status = error.status;

      return throwError(() => userFriendlyError);
    })
  );
};
```

**What it does:**
- Intercepts all HTTP errors globally
- Maps error codes to user-friendly messages
- Handles authentication errors (401) automatically
- Logs errors for debugging
- Preserves original error for debugging

### 2. Registered Error Interceptor

**File**: `src/main.ts`

#### Before
```typescript
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

#### After
```typescript
provideHttpClient(
  withInterceptors([
    authInterceptor,  // Add auth token
    errorInterceptor   // Handle errors globally
  ])
)
```

**Important:** Error interceptor comes after auth interceptor so it can catch errors from authenticated requests.

## 📚 Key Concepts Explained

### HTTP Error Status Codes

#### Client Errors (4xx)
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or token invalid
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource conflict (e.g., duplicate)
- **422 Unprocessable Entity**: Validation errors

#### Server Errors (5xx)
- **500 Internal Server Error**: Server-side error
- **502 Bad Gateway**: Server acting as gateway received invalid response
- **503 Service Unavailable**: Server temporarily unavailable

#### Network Errors
- **0**: Network error, CORS issue, or server unreachable

### Error Handling Flow

```
HTTP Request
    ↓
Auth Interceptor (adds token)
    ↓
Request sent to server
    ↓
Error Response received
    ↓
Error Interceptor catches error
    ↓
Maps error to user-friendly message
    ↓
Handles special cases (401 → logout)
    ↓
Returns error to component
    ↓
Component handles error
```

### Error Message Priority

The interceptor tries to extract error messages in this order:

1. **Server error message**: `error.error.error.message`
2. **Generic error message**: `error.error.message`
3. **Default message**: Based on status code
4. **Fallback**: Generic "An unknown error occurred"

### Special Error Handling

#### 401 Unauthorized
```typescript
case 401:
  errorMessage = 'Your session has expired. Please login again.';
  // Automatically logout and redirect
  authService.logout();
  router.navigate(['/login'], {
    queryParams: { returnUrl: router.url }
  });
  break;
```

**Why this is important:**
- Token might be expired
- User needs to login again
- Preserves attempted URL for redirect after login

### Error Logging

```typescript
console.error('HTTP Error:', {
  status: error.status,
  message: errorMessage,
  url: req.url,
  method: req.method,
  error: errorBody
});
```

**Benefits:**
- Helps with debugging
- Tracks error patterns
- Provides context for errors

## 💡 Code Highlights

### Error Interceptor Structure

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inject dependencies
  const router = inject(Router);
  const authService = inject(AuthService);

  // 2. Intercept response
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 3. Handle error
      let errorMessage = 'An unknown error occurred';
      
      // 4. Check error type
      if (error.error instanceof ErrorEvent) {
        // Client-side error
      } else {
        // Server-side error
        switch (error.status) {
          // Handle different status codes
        }
      }

      // 5. Create user-friendly error
      const userFriendlyError = new Error(errorMessage);
      
      // 6. Attach original error for debugging
      (userFriendlyError as any).originalError = error;
      
      // 7. Return error
      return throwError(() => userFriendlyError);
    })
  );
};
```

### Error Message Mapping

```typescript
// Extract message from error body
const errorMessage = errorBody?.error?.message || 
                     errorBody?.message || 
                     'Default message';

// Or use status-based defaults
switch (status) {
  case 400:
    errorMessage = 'Invalid request. Please check your input.';
    break;
  case 404:
    errorMessage = 'The requested resource was not found.';
    break;
  case 500:
    errorMessage = 'Server error. Please try again later.';
    break;
}
```

### Preserving Original Error

```typescript
const userFriendlyError = new Error(errorMessage);

// Attach original error for debugging
(userFriendlyError as any).originalError = error;
(userFriendlyError as any).status = error.status;
```

**Why preserve original error?**
- Components can access original error if needed
- Debugging information available
- Status code accessible for conditional handling

## ✅ How It Works

### Before Error Interceptor

```typescript
// Component needs to handle all errors
this.taskService.getAllTasks().subscribe({
  next: (tasks) => {
    this.tasks = tasks;
  },
  error: (error) => {
    // Need to parse error manually
    let message = 'An error occurred';
    if (error.status === 401) {
      message = 'Please login again';
      this.authService.logout();
      this.router.navigate(['/login']);
    } else if (error.status === 404) {
      message = 'Not found';
    } else if (error.status === 500) {
      message = 'Server error';
    }
    alert(message);
  }
});
```

**Problems:**
- Repetitive error handling code
- Inconsistent error messages
- Easy to miss error cases
- Authentication errors not handled consistently

### After Error Interceptor

```typescript
// Component gets user-friendly error automatically
this.taskService.getAllTasks().subscribe({
  next: (tasks) => {
    this.tasks = tasks;
  },
  error: (error) => {
    // Error is already user-friendly
    // 401 already handled (logout + redirect)
    alert(error.message);
  }
});
```

**Benefits:**
- Consistent error messages
- Automatic 401 handling
- Less code in components
- Centralized error handling

## 🎓 Learning Outcomes

After this commit, you should understand:

1. **Global Error Handling**
   - Why interceptors are perfect for error handling
   - How to catch all HTTP errors in one place
   - Benefits of centralized error handling

2. **HTTP Error Codes**
   - Common status codes and their meanings
   - When to use each error code
   - How to extract error messages

3. **User Experience**
   - Converting technical errors to user-friendly messages
   - Automatic handling of authentication errors
   - Preserving error context for debugging

4. **Error Logging**
   - What information to log
   - How to structure error logs
   - When to log vs. when to show user

## 🚀 What's Next

**Next Step: Complete Application Features**

We've now completed:
- ✅ HTTP and API integration
- ✅ Authentication (login/register)
- ✅ Auth interceptor (JWT tokens)
- ✅ Auth guard (route protection)
- ✅ Error interceptor (global error handling)
- ✅ RxJS essentials
- ✅ State management

**Remaining features:**
- UI enhancements
- Loading states
- Reusable components
- Additional features

---

## 💡 Tips for Learning

1. **Error Interceptor Order**: Place error interceptor last so it catches all errors
2. **User-Friendly Messages**: Always convert technical errors to messages users understand
3. **401 Handling**: Automatically logout and redirect on 401 errors
4. **Error Logging**: Log detailed errors for debugging, show simple messages to users
5. **Preserve Context**: Attach original error for debugging while showing friendly message

## 🎓 Practice Exercises

Try these to reinforce learning:

1. Add a toast notification service to show errors
2. Implement retry logic for network errors
3. Add error reporting to external service
4. Create different error messages for different user roles
5. Add error analytics tracking

---

**Commit Message:**
```
feat(interceptor): add global error interceptor for HTTP error handling

- Create errorInterceptor to catch all HTTP errors globally
- Map error status codes to user-friendly messages
- Handle 401 errors automatically (logout and redirect)
- Handle common HTTP errors (400, 403, 404, 500, etc.)
- Preserve original error for debugging
- Log errors with context (URL, method, status)
- Register error interceptor in main.ts
- Provide consistent error handling across application

Topic: HTTP Interceptors & Error Handling
Build: ✅ Verified successful (1.89MB bundle)
```
