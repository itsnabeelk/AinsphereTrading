import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

@Injectable({
    providedIn: 'root'
})
export class MepServiceDetailService {

    private baseUrl = `${API_BASE_URL}/mep-service-detail`;

    constructor(private http: HttpClient) { }

    /* ===================================================== */
    /* ================= IMAGE HELPER ======================= */
    /* ===================================================== */

    getImage(path: string | null): string {
        if (!path) return 'assets/img/placeholder-image.png';

        if (path.startsWith('http')) return path;

        const normalizedPath = path.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

        return `${API_BASE_URL}${cleanPath}`;
    }

    /* ===================================================== */
    /* ================= PUBLIC ============================= */
    /* ===================================================== */

    getBySlug(slug: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/public/${slug}`);
    }

    /* ===================================================== */
    /* ================= MAIN DETAIL ======================== */
    /* ===================================================== */

    getAdmin(serviceId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/admin/${serviceId}`);
    }

    saveDetail(serviceId: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}/admin/${serviceId}`, formData);
    }

    /* ===================================================== */
    /* ================= SECTIONS =========================== */
    /* ===================================================== */

    getSections(serviceId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/admin/${serviceId}/sections`);
    }

    createSection(serviceId: number, data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/admin/${serviceId}/sections`, data);
    }

    updateSection(id: number, data: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/sections/${id}`, data);
    }

    deleteSection(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/sections/${id}`);
    }

    /* ===================================================== */
    /* ================= POINTS ============================= */
    /* ===================================================== */

    getPoints(serviceId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/admin/${serviceId}/points`);
    }

    createPoint(serviceId: number, data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/admin/${serviceId}/points`, data);
    }

    updatePoint(id: number, data: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/points/${id}`, data);
    }

    deletePoint(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/points/${id}`);
    }

    /* ===================================================== */
    /* ================= PRODUCTS =========================== */
    /* ===================================================== */

    getProducts(serviceId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/admin/${serviceId}/products`);
    }

    createProduct(serviceId: number, formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/admin/${serviceId}/products`, formData);
    }

    updateProduct(id: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}/products/${id}`, formData);
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/products/${id}`);
    }

}
