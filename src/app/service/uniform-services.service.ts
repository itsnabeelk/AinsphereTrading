import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* ================= MODEL ================= */

export interface UniformService {
    id: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    image: string | null;
    slug: string;
    is_active: number;
}

/* ================= SERVICE ================= */

@Injectable({
    providedIn: 'root'
})
export class UniformServicesService {

    private baseUrl = `${API_BASE_URL}/uniform-services`;

    constructor(private http: HttpClient) { }

    /* ================= PUBLIC ================= */

    getPublic(): Observable<UniformService[]> {
        return this.http.get<UniformService[]>(`${this.baseUrl}/public`);
    }

    /* ================= ADMIN ================= */

    getAdmin(): Observable<UniformService[]> {
        return this.http.get<UniformService[]>(`${this.baseUrl}/admin`);
    }

    create(formData: FormData): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.baseUrl}/admin`, formData);
    }

    update(id: number, formData: FormData): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.baseUrl}/admin/${id}`, formData);
    }

    delete(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/admin/${id}`);
    }

    toggleStatus(id: number, status: number): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(
            `${this.baseUrl}/admin/toggle/${id}`,
            { is_active: status }
        );
    }

    /* ================= IMAGE HELPER ================= */

    getImage(path?: string | null): string {
        if (!path) return 'assets/img/placeholder-image.png';

        if (path.startsWith('http')) return path;

        const normalizedPath = path.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

        return `${API_BASE_URL}${cleanPath}`;
    }
}
