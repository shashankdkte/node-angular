import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Error Interceptor - Global HTTP Error Handling
 * 
 * This interceptor catches all HTTP errors and:
 * - Maps error codes to user-friendly messages
 * - Handles authentication errors (401, 403)
 * - Handles common HTTP errors (404, 500, etc.)
 * - Logs errors for debugging
 * - Can redirect on specific errors
 */
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
            // Network error or CORS issue
            errorMessage = 'Unable to connect to server. Please check your internet connection.';
            break;
          
          case 400:
            // Bad Request
            errorMessage = errorBody?.error?.message || 
                          errorBody?.message || 
                          'Invalid request. Please check your input.';
            break;
          
          case 401:
            // Unauthorized - Token expired or invalid
            errorMessage = 'Your session has expired. Please login again.';
            // Clear auth data and redirect to login
            authService.logout();
            router.navigate(['/login'], {
              queryParams: { returnUrl: router.url }
            });
            break;
          
          case 403:
            // Forbidden
            errorMessage = errorBody?.error?.message || 
                          errorBody?.message || 
                          'You do not have permission to perform this action.';
            break;
          
          case 404:
            // Not Found
            errorMessage = errorBody?.error?.message || 
                          errorBody?.message || 
                          'The requested resource was not found.';
            break;
          
          case 409:
            // Conflict
            errorMessage = errorBody?.error?.message || 
                          errorBody?.message || 
                          'A conflict occurred. The resource may have been modified.';
            break;
          
          case 422:
            // Unprocessable Entity (validation errors)
            errorMessage = errorBody?.error?.message || 
                          errorBody?.message || 
                          'Validation failed. Please check your input.';
            break;
          
          case 500:
            // Internal Server Error
            errorMessage = 'Server error. Please try again later.';
            console.error('Server error:', errorBody);
            break;
          
          case 502:
            // Bad Gateway
            errorMessage = 'Server is temporarily unavailable. Please try again later.';
            break;
          
          case 503:
            // Service Unavailable
            errorMessage = 'Service is temporarily unavailable. Please try again later.';
            break;
          
          default:
            // Other errors
            if (errorBody?.error?.message) {
              errorMessage = errorBody.error.message;
            } else if (errorBody?.message) {
              errorMessage = errorBody.message;
            } else {
              errorMessage = `Error ${status}: ${error.message || 'An error occurred'}`;
            }
        }

        // Log server errors for debugging
        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: req.url,
          method: req.method,
          error: errorBody
        });
      }

      // Create a user-friendly error object
      const userFriendlyError = new Error(errorMessage);
      
      // Attach original error for debugging (optional)
      (userFriendlyError as any).originalError = error;
      (userFriendlyError as any).status = error.status;

      // Return error that components can handle
      return throwError(() => userFriendlyError);
    })
  );
};
