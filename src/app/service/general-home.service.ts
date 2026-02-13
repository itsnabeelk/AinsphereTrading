import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface GeneralHero {
    id: number;
    title_en: string;
    title_ar: string;
    image: string;
    sort_order: number;
    is_active: number;
}

@Injectable({
    providedIn: 'root'
})
export class GeneralHomeService {

    private baseUrl = `${API_BASE_URL}/general/home`;


    constructor(private http: HttpClient) { }

    /* ================= PUBLIC ================= */

    getPublicHero(): Observable<GeneralHero[]> {
        return this.http.get<GeneralHero[]>(`${this.baseUrl}/public/hero`);
    }

    /* ================= ADMIN ================= */

    getAdminHero(): Observable<GeneralHero[]> {
        return this.http.get<GeneralHero[]>(`${this.baseUrl}/admin/hero`);
    }

    createHero(formData: FormData) {
        return this.http.post(`${this.baseUrl}/admin/hero`, formData);
    }

    updateHero(id: number, formData: FormData) {
        return this.http.put(`${this.baseUrl}/admin/hero/${id}`, formData);
    }

    deleteHero(id: number) {
        return this.http.delete(`${this.baseUrl}/admin/hero/${id}`);
    }

    toggleHero(id: number) {
        return this.http.put(`${this.baseUrl}/admin/hero/toggle/${id}`, {});
    }

}
