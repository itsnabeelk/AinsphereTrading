import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* ================= INTERFACE ================= */
export interface CareerJob {
    id: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    job_type: string;
    location: string;
    salary: string;
    sort_order: number;
    is_active: number;
}

/* ================= SERVICE ================= */
@Injectable({
    providedIn: 'root'
})
export class CareerService {

    private baseUrl = `${API_BASE_URL}/careers`;

    constructor(private http: HttpClient) { }

    /* ================= PUBLIC ================= */
    getPublic(): Observable<CareerJob[]> {
        return this.http.get<CareerJob[]>(`${this.baseUrl}/public`);
    }

    apply(data: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/apply`, data);
    }

    /* ================= ADMIN ================= */

    add(data: any) {
        return this.http.post(`${this.baseUrl}/add`, data, {
            headers: { 'x-dashboard-auth': localStorage.getItem('token') || '' }
        });
    }

    update(id: number, data: any) {
        return this.http.put(`${this.baseUrl}/edit/${id}`, data, {
            headers: { 'x-dashboard-auth': localStorage.getItem('token') || '' }
        });
    }

    delete(id: number) {
        return this.http.delete(`${this.baseUrl}/delete/${id}`, {
            headers: { 'x-dashboard-auth': localStorage.getItem('token') || '' }
        });
    }

    toggle(id: number) {
        return this.http.put(`${this.baseUrl}/toggle/${id}`, {}, {
            headers: { 'x-dashboard-auth': localStorage.getItem('token') || '' }
        });
    }
}