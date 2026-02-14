import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* =========================================================
   INTERFACES
========================================================= */

export interface GeneralServiceBasic {
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

export interface GeneralServiceDetail {
    id: number;
    service_id: number;
    hero_image: string | null;
    main_heading_en: string;
    main_heading_ar: string;
    sub_heading_en: string;
    sub_heading_ar: string;
    is_active: number;
}

export interface GeneralServiceSection {
    id: number;
    service_id: number;
    heading_en: string;
    heading_ar: string;
    paragraph_en: string;
    paragraph_ar: string;
    sort_order: number;
}

export interface GeneralServicePoint {
    id: number;
    service_id: number;
    small_heading_en: string;
    small_heading_ar: string;
    points_en: string[];
    points_ar: string[];
    sort_order: number;
}

export interface GeneralServiceProduct {
    id: number;
    service_id: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    image: string;
    sort_order: number;
    is_active?: number;
}

export interface GeneralServiceDetailResponse {
    service: GeneralServiceBasic;
    detail: GeneralServiceDetail | null;
    sections: GeneralServiceSection[];
    points: GeneralServicePoint[];
    products: GeneralServiceProduct[];
}

/* =========================================================
   SERVICE
========================================================= */

@Injectable({
    providedIn: 'root'
})
export class GeneralServiceDetailService {

    private baseUrl = `${API_BASE_URL}/general-service-detail`;

    constructor(private http: HttpClient) { }

    /* ================= PUBLIC ================= */

    getBySlug(slug: string): Observable<GeneralServiceDetailResponse> {
        return this.http.get<GeneralServiceDetailResponse>(
            `${this.baseUrl}/public/${slug}`
        );
    }

    /* ================= ADMIN - DETAIL ================= */

    getAdminDetail(serviceId: number): Observable<GeneralServiceDetail> {
        return this.http.get<GeneralServiceDetail>(
            `${this.baseUrl}/admin/${serviceId}`
        );
    }

    saveDetail(formData: FormData): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/admin/save`,
            formData
        );
    }

    /* ================= ADMIN - SECTIONS ================= */

    getSections(serviceId: number): Observable<GeneralServiceSection[]> {
        return this.http.get<GeneralServiceSection[]>(
            `${this.baseUrl}/admin/sections/${serviceId}`
        );
    }

    createSection(payload: any): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/admin/section/create`,
            payload
        );
    }

    updateSection(id: number, payload: any): Observable<any> {
        return this.http.put(
            `${this.baseUrl}/admin/section/update/${id}`,
            payload
        );
    }

    deleteSection(id: number): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}/admin/section/${id}`
        );
    }

    /* ================= ADMIN - POINTS ================= */

    getPoints(serviceId: number): Observable<GeneralServicePoint[]> {
        return this.http.get<GeneralServicePoint[]>(
            `${this.baseUrl}/admin/points/${serviceId}`
        );
    }

    createPoint(payload: any): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/admin/point/create`,
            payload
        );
    }

    updatePoint(id: number, payload: any): Observable<any> {
        return this.http.put(
            `${this.baseUrl}/admin/point/update/${id}`,
            payload
        );
    }

    deletePoint(id: number): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}/admin/point/${id}`
        );
    }

    /* ================= ADMIN - PRODUCTS ================= */

    getProducts(serviceId: number): Observable<GeneralServiceProduct[]> {
        return this.http.get<GeneralServiceProduct[]>(
            `${this.baseUrl}/admin/products/${serviceId}`
        );
    }

    createProduct(formData: FormData): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/admin/product/create`,
            formData
        );
    }

    updateProduct(id: number, formData: FormData): Observable<any> {
        return this.http.put(
            `${this.baseUrl}/admin/product/update/${id}`,
            formData
        );
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}/admin/product/delete/${id}`
        );
    }

    /* ================= IMAGE HELPER ================= */

    getImage(path: string | null): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    }
}
