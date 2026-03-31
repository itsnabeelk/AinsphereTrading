import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* ================= MODEL ================= */

export interface MepService {
    id: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    image: string;
    slug: string;
    is_active: number;
}

/* ================= SERVICE ================= */

@Injectable({
    providedIn: 'root'
})
export class MepServicesService {

    private baseUrl = `${API_BASE_URL}/mep-services`;

    constructor(private http: HttpClient) { }

    /* ================= PUBLIC ================= */

    getPublic(): Observable<MepService[]> {
        return this.http.get<MepService[]>(`${this.baseUrl}/public`);
    }

    /* ================= ADMIN ================= */

    getAdmin(): Observable<MepService[]> {
        return this.http.get<MepService[]>(`${this.baseUrl}/admin`);
    }

    create(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/admin`, formData);
    }

    update(id: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}/admin/${id}`, formData);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/admin/${id}`);
    }

    /* ================= IMAGE HELPER ================= */

    getImage(path?: string | null): string {
        if (!path) return 'assets/img/placeholder-image.png';

        if (path.startsWith('http')) return path;

        const normalizedPath = path.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

        return `${API_BASE_URL}${cleanPath}`;
    }
    toggleStatus(id: number, status: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/admin/toggle/${id}`, {
            is_active: status
        });
    }

}
