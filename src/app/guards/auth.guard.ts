import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {

        const token = localStorage.getItem('dashboard_token');

        if (!token) {
            this.router.navigate(['/dashboard/login']);
            return false;
        }


        try {
            const decoded: any = jwtDecode(token);
            const expiry = decoded.exp * 1000;

            if (Date.now() > expiry) {
                localStorage.removeItem('dashboard_token');
                this.router.navigate(['/dashboard/login']);

                return false;
            }

            return true;

        } catch {
            localStorage.removeItem('dashboard_token');
            this.router.navigate(['/dashboard/login']);

            return false;
        }
    }
}
