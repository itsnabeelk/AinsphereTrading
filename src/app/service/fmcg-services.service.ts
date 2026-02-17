import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* =========================================================
   INTERFACES
========================================================= */

export interface FmcgServicePage {
    id: number;
    breadcrumb_title_en: string;
    breadcrumb_title_ar: string;
    is_active: number;
}

export interface FmcgService {
    id: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    slug: string;
    image: string;
    sort_order: number;
    is_active: number;
}

/* =========================================================
   SERVICE
========================================================= */

@Injectable({
    providedIn: 'root'
})
export class FmcgServicesService {

    private baseUrl = `${API_BASE_URL}/fmcg-services`;

    constructor(private http: HttpClient) { }

    /* ================= PUBLIC ================= */

    getListPage(): Observable<{
        page: FmcgServicePage | null;
        services: FmcgService[];
    }> {
        return this.http.get<{
            page: FmcgServicePage | null;
            services: FmcgService[];
        }>(`${this.baseUrl}/public`);
    }

    getBySlug(slug: string): Observable<FmcgService> {
        return this.http.get<FmcgService>(
            `${this.baseUrl}/public/${slug}`
        );
    }

    /* ================= ADMIN ================= */

    getAdminList(): Observable<FmcgService[]> {
        return this.http.get<FmcgService[]>(
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

    /* ================= IMAGE HELPER ================= */

    getImage(path: string | null): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;

        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${API_BASE_URL}${cleanPath}`;
    }
}
