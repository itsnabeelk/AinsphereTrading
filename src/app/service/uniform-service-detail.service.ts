import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* ================= MODELS ================= */

export interface UniformServiceDetailResponse {
    service: any;
    detail: any;
    sections: any[];
    points: any[];
    products: any[];
}

@Injectable({
    providedIn: 'root'
})
export class UniformServiceDetailService {

    private baseUrl = `${API_BASE_URL}/uniform-service-detail`;

    constructor(private http: HttpClient) { }

    /* ===================================================== */
    /* ================= IMAGE HELPER ======================= */
    /* ===================================================== */

    getImage(path: string | null): string {
        if (!path) return 'assets/img/placeholder-image.png';

        // if already full URL
        if (path.startsWith('http')) return path;

        return `${API_BASE_URL.replace('/api', '')}${path}`;
    }

    /* ===================================================== */
    /* ================= PUBLIC ============================= */
    /* ===================================================== */

    getBySlug(slug: string): Observable<UniformServiceDetailResponse> {
        return this.http.get<UniformServiceDetailResponse>(
            `${this.baseUrl}/public/${slug}`
        );
    }

    /* ===================================================== */
    /* ================= MAIN DETAIL ======================== */
    /* ===================================================== */

    getAdmin(serviceId: number): Observable<UniformServiceDetailResponse> {
        return this.http.get<UniformServiceDetailResponse>(
            `${this.baseUrl}/admin/${serviceId}`
        );
    }

    saveDetail(serviceId: number, formData: FormData): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(
            `${this.baseUrl}/admin/${serviceId}`,
            formData
        );
    }

    /* ===================================================== */
    /* ================= SECTIONS =========================== */
    /* ===================================================== */

    getSections(serviceId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.baseUrl}/admin/${serviceId}/sections`
        );
    }

    createSection(serviceId: number, data: any): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${this.baseUrl}/admin/${serviceId}/sections`,
            data
        );
    }

    updateSection(id: number, data: any): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(
            `${this.baseUrl}/sections/${id}`,
            data
        );
    }

    deleteSection(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(
            `${this.baseUrl}/sections/${id}`
        );
    }

    /* ===================================================== */
    /* ================= POINTS ============================= */
    /* ===================================================== */

    getPoints(serviceId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.baseUrl}/admin/${serviceId}/points`
        );
    }

    createPoint(serviceId: number, data: any): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${this.baseUrl}/admin/${serviceId}/points`,
            data
        );
    }

    updatePoint(id: number, data: any): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(
            `${this.baseUrl}/points/${id}`,
            data
        );
    }

    deletePoint(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(
            `${this.baseUrl}/points/${id}`
        );
    }

    /* ===================================================== */
    /* ================= PRODUCTS =========================== */
    /* ===================================================== */

    getProducts(serviceId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.baseUrl}/admin/${serviceId}/products`
        );
    }

    createProduct(serviceId: number, formData: FormData): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${this.baseUrl}/admin/${serviceId}/products`,
            formData
        );
    }

    updateProduct(id: number, formData: FormData): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(
            `${this.baseUrl}/products/${id}`,
            formData
        );
    }

    deleteProduct(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(
            `${this.baseUrl}/products/${id}`
        );
    }

}