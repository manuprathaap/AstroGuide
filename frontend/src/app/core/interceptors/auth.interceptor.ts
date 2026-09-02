import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If unauthorized (401) and not already on auth pages, clear token and redirect to login
      if (error.status === 401) {
        localStorage.removeItem('access_token');
        const currentUrl = router.url;
        if (!currentUrl.includes('/auth/login') && !currentUrl.includes('/auth/register')) {
          router.navigate(['/auth/login'], {
            queryParams: { message: 'Session expired. Please sign in again.' }
          });
        }
      }
      return throwError(() => error);
    })
  );
};
