import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface GeneralWorking {
    id: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    sort_order: number;
    is_active: number;
    created_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class GeneralWorkingService {

    private baseUrl = `${API_BASE_URL}/general/home`;

    constructor(private http: HttpClient) { }

    /* =========================
       PUBLIC
    ========================= */

    getPublicWorking(): Observable<GeneralWorking[]> {
        return this.http.get<GeneralWorking[]>(
            `${this.baseUrl}/public/working`
        );
    }

    /* =========================
       ADMIN
    ========================= */

    getAdminWorking(): Observable<GeneralWorking[]> {
        return this.http.get<GeneralWorking[]>(
            `${this.baseUrl}/admin/working`
        );
    }

    createWorking(data: Partial<GeneralWorking>) {
        return this.http.post(
            `${this.baseUrl}/admin/working`,
            data
        );
    }

    updateWorking(id: number, data: Partial<GeneralWorking>) {
        return this.http.put(
            `${this.baseUrl}/admin/working/${id}`,
            data
        );
    }

    deleteWorking(id: number) {
        return this.http.delete(
            `${this.baseUrl}/admin/working/${id}`
        );
    }

    toggleWorking(id: number) {
        return this.http.put(
            `${this.baseUrl}/admin/working/toggle/${id}`,
            {}
        );
    }
}
