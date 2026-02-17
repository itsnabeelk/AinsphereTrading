import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* =========================================================
   INTERFACES
========================================================= */

export interface FmcgServiceBasic {
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

export interface FmcgServiceDetail {
    id: number;
    service_id: number;
    hero_image: string | null;
    main_heading_en: string;
    main_heading_ar: string;
    sub_heading_en: string;
    sub_heading_ar: string;
    is_active: number;
}

export interface FmcgServiceSection {
    id: number;
    service_id: number;
    heading_en: string;
    heading_ar: string;
    paragraph_en: string;
    paragraph_ar: string;
    sort_order: number;
}

export interface FmcgServicePoint {
    id: number;
    service_id: number;
    small_heading_en: string;
    small_heading_ar: string;
    points_en: string[];
    points_ar: string[];
    sort_order: number;
}

export interface FmcgServiceProduct {
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

export interface FmcgServiceDetailResponse {
    service: FmcgServiceBasic;
    detail: FmcgServiceDetail | null;
    sections: FmcgServiceSection[];
    points: FmcgServicePoint[];
    products: FmcgServiceProduct[];
}

/* =========================================================
   SERVICE
========================================================= */

@Injectable({
    providedIn: 'root'
})
export class FmcgServiceDetailService {

    private baseUrl = `${API_BASE_URL}/fmcg-service-detail`;

    constructor(private http: HttpClient) { }

    /* ================= PUBLIC ================= */

    getBySlug(slug: string): Observable<FmcgServiceDetailResponse> {
        return this.http.get<FmcgServiceDetailResponse>(
            `${this.baseUrl}/public/${slug}`
        );
    }

    /* ================= ADMIN - DETAIL ================= */

    getAdminDetail(serviceId: number): Observable<FmcgServiceDetail> {
        return this.http.get<FmcgServiceDetail>(
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

    getSections(serviceId: number): Observable<FmcgServiceSection[]> {
        return this.http.get<FmcgServiceSection[]>(
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

    getPoints(serviceId: number): Observable<FmcgServicePoint[]> {
        return this.http.get<FmcgServicePoint[]>(
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

    getProducts(serviceId: number): Observable<FmcgServiceProduct[]> {
        return this.http.get<FmcgServiceProduct[]>(
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
