import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const router = inject(Router);
    const token = localStorage.getItem('dashboard_token');

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {

            if (err.status === 401) {
                localStorage.removeItem('dashboard_token');
                router.navigate(['/dashboard/login']);
            }

            return throwError(() => err);
        })
    );
};
