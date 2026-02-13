import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = `${API_BASE_URL}/auth`;

    private userSubject = new BehaviorSubject<any | undefined>(undefined);

    user$ = this.userSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    // ================= LOGIN =================
    login(email: string, password: string) {
        return this.http.post(`${this.apiUrl}/login`, { email, password });
    }

    saveToken(token: string) {
        localStorage.setItem('dashboard_token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('dashboard_token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    // ================= USER STATE =================
    setUser(user: any) {
        this.userSubject.next(user);
    }

    clearUser() {
        this.userSubject.next(null);
    }

    // ================= LOGOUT =================
    logout() {
        localStorage.removeItem('dashboard_token');
        this.clearUser();
        this.router.navigate(['/dashboard/login']);
    }

    // ================= PROFILE =================
    getProfile() {
        return this.http.get(`${this.apiUrl}/profile`);
    }

    updateProfile(formData: FormData) {
        return this.http.put(`${this.apiUrl}/profile`, formData);
    }

    changePassword(data: any) {
        return this.http.put(`${this.apiUrl}/change-password`, data);
    }
    getCurrentUser() {
        return this.userSubject.value;
    }

    initializeUser(): void {

        const token = this.getToken();

        if (!token) {
            this.userSubject.next(null);
            return;
        }

        this.getProfile().subscribe({
            next: (res: any) => {
                this.setUser(res.user);
            },
            error: () => {
                this.userSubject.next(null);
                this.logout();
            }
        });
    }


}
