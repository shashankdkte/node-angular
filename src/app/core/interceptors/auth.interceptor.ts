import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Get token from AuthService
  const token = authService.getToken();
  
  // If token exists, add it to the request headers
  if (token) {
    // Clone the request and add Authorization header
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(clonedRequest);
  }
  
  // If no token, proceed with original request
  return next(req);
};
