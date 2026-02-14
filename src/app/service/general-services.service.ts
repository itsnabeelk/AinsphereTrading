import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* =========================================================
   INTERFACES
========================================================= */

export interface GeneralServicePage {
    id: number;
    breadcrumb_title_en: string;
    breadcrumb_title_ar: string;
    is_active: number;
}

export interface GeneralService {
    id: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    slug: string;
    image: string;
    sort_order: number;
    is_active: number;
    created_at?: string;
    updated_at?: string;
}

/* =========================================================
   SERVICE
========================================================= */

@Injectable({
    providedIn: 'root'
})
export class GeneralServicesService {

    private baseUrl = `${API_BASE_URL}/general-services`;

    constructor(private http: HttpClient) { }

    /* =========================================================
       PUBLIC
    ========================================================= */

    getListPage(): Observable<{
        page: GeneralServicePage | null;
        services: GeneralService[];
    }> {
        return this.http.get<{
            page: GeneralServicePage | null;
            services: GeneralService[];
        }>(`${this.baseUrl}/public`);
    }

    getBySlug(slug: string): Observable<GeneralService> {
        return this.http.get<GeneralService>(
            `${this.baseUrl}/public/${slug}`
        );
    }

    /* =========================================================
       ADMIN
    ========================================================= */

    getAdminList(): Observable<GeneralService[]> {
        return this.http.get<GeneralService[]>(
            `${this.baseUrl}/admin`
        );
    }

    createService(formData: FormData): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/admin/create`,
            formData
        );
    }

    updateService(id: number, formData: FormData): Observable<any> {
        return this.http.put(
            `${this.baseUrl}/admin/update/${id}`,
            formData
        );
    }

    deleteService(id: number): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}/admin/delete/${id}`
        );
    }

    toggleService(id: number): Observable<any> {
        return this.http.put(
            `${this.baseUrl}/admin/toggle/${id}`,
            {}
        );
    }

    /* =========================================================
       IMAGE HELPER
    ========================================================= */

    getImage(path: string): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    }
}
