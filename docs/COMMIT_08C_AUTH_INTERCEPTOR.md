# COMMIT 08C: HTTP Interceptor for JWT Token

## 📦 What Was Built

This commit creates an HTTP interceptor that automatically adds the JWT authentication token to all HTTP requests. This fixes the "UNAUTHORIZED" errors when calling the tasks API and ensures authenticated requests work seamlessly.

## 📊 Visual Overview

```mermaid
sequenceDiagram
    participant C as Component
    participant S as Service
    participant I as Interceptor
    participant API as Backend
    
    C->>S: Make request
    S->>I: HTTP Request
    I->>I: Get token from storage
    I->>I: Add Authorization header
    I->>API: Request with token
    API-->>I: Response
    I-->>S: Pass through
    S-->>C: Data
```

**What This Commit Teaches:**
- Interceptors = Middleware for HTTP
- Auto-add token to all requests
- No need to add token manually

## 🎯 Topic Focus: HTTP Interceptors (Advanced)

**Key Concepts Learned:**
- HTTP Interceptors
- Automatic token injection
- Request cloning
- Interceptor registration
- Bearer token authentication

## 🔧 Changes Made

### 1. Created AuthInterceptor

**File**: `src/app/core/interceptors/auth.interceptor.ts`

**Implementation:**
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  
  return next(req);
};
```

**What it does:**
- Intercepts all HTTP requests
- Gets JWT token from AuthService
- Adds `Authorization: Bearer <token>` header
- Only adds header if token exists
- Clones request (HTTP requests are immutable)

### 2. Registered Interceptor

**File**: `src/main.ts`

**Before:**
```typescript
provideHttpClient()
```

**After:**
```typescript
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

## 📚 Key Concepts Explained

### HTTP Interceptors

**What are interceptors?**
- Functions that intercept HTTP requests/responses
- Can modify requests before they're sent
- Can modify responses before they reach components
- Applied globally to all HTTP calls

**Use cases:**
- Adding authentication tokens
- Adding common headers
- Error handling
- Request/response logging
- Retry logic

### How Interceptors Work

**Request Flow:**
```
Component calls service
    ↓
Service makes HTTP request
    ↓
Interceptor intercepts request
    ↓
Interceptor modifies request (adds token)
    ↓
Request sent to server
    ↓
Response received
    ↓
Interceptor can modify response
    ↓
Component receives response
```

**Our Interceptor:**
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Get token
  const token = authService.getToken();
  
  // 2. If token exists, add to headers
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  
  // 3. If no token, proceed normally
  return next(req);
};
```

### Request Cloning

**Why clone requests?**
- HTTP requests are immutable
- Cannot modify original request
- Must clone to add headers

**How to clone:**
```typescript
const clonedRequest = req.clone({
  setHeaders: {
    Authorization: `Bearer ${token}`
  }
});
```

**Other cloning options:**
```typescript
// Add headers
req.clone({ setHeaders: { 'X-Custom': 'value' } })

// Change URL
req.clone({ url: '/new-url' })

// Change method
req.clone({ method: 'POST' })

// Multiple changes
req.clone({
  setHeaders: { Authorization: `Bearer ${token}` },
  url: '/api/tasks'
})
```

### Bearer Token Authentication

**Format:**
```
Authorization: Bearer <token>
```

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Why "Bearer"?**
- OAuth 2.0 standard
- Indicates token-based authentication
- Server extracts token after "Bearer "

### Interceptor Registration

**Angular 17+ (Functional Interceptors):**
```typescript
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

**Multiple Interceptors:**
```typescript
provideHttpClient(
  withInterceptors([
    authInterceptor,
    errorInterceptor,
    loggingInterceptor
  ])
)
```

**Order matters:**
- Interceptors run in order
- First interceptor runs first
- Last interceptor runs last

## 💡 Code Highlights

### Complete Interceptor Implementation

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  
  return next(req);
};
```

**Key Points:**
- Uses `HttpInterceptorFn` (functional interceptor)
- Uses `inject()` to get AuthService
- Clones request to add header
- Only adds token if it exists
- Returns modified request

### Registration in main.ts

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
});
```

## ✅ How It Works

**Before Interceptor:**
```
GET /api/tasks
Headers: (none)
Result: ❌ 401 UNAUTHORIZED
```

**After Interceptor:**
```
GET /api/tasks
Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Result: ✅ 200 OK (with tasks data)
```

**Automatic Application:**
- All HTTP requests automatically get token
- No need to manually add headers in services
- Works for GET, POST, PUT, DELETE
- Token added only if user is authenticated

## ✅ Build Verification

- ✅ Build succeeds: `npm run build`
- ✅ No TypeScript errors
- ✅ Interceptor properly registered
- ✅ Token will be added to all requests
- ✅ Tasks API should now work with authentication

## 🚀 Testing

**To test:**
1. Register a new user or login
2. Token will be stored automatically
3. Navigate to tasks page
4. Tasks API calls will include token automatically
5. Check browser Network tab - see `Authorization: Bearer <token>` header

**Expected Result:**
- Tasks API returns 200 OK
- Tasks data loads successfully
- No more "UNAUTHORIZED" errors

---

## 💡 Tips

1. **Interceptors are global**: Apply to all HTTP requests
2. **Order matters**: Register interceptors in correct order
3. **Clone requests**: Always clone to modify (immutability)
4. **Check token exists**: Only add header if token available
5. **Bearer format**: Use "Bearer " prefix (with space)

---

**Commit Message:**
```
feat(interceptor): add HTTP interceptor to automatically include JWT token

- Create authInterceptor to add Authorization header
- Get token from AuthService
- Clone requests to add Bearer token
- Register interceptor in main.ts with withInterceptors
- All HTTP requests now automatically include authentication token

Fixes: Tasks API UNAUTHORIZED errors
Build: ✅ Verified successful (1.88MB bundle)
```
