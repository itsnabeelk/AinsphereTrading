import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface GeneralAbout {
    id: number;
    title_en: string;
    title_ar: string;
    description_1_en: string;
    description_1_ar: string;
    description_2_en: string;
    description_2_ar: string;
    image: string;
    brochure_en: string;
    brochure_ar: string;
    is_active: number;
}


@Injectable({
    providedIn: 'root'
})
export class GeneralAboutService {

    private baseUrl = `${API_BASE_URL}/general/home`;

    constructor(private http: HttpClient) { }

    /* ================= PUBLIC ================= */

    getPublicAbout(): Observable<GeneralAbout> {
        return this.http.get<GeneralAbout>(`${this.baseUrl}/public/about`);
    }

    /* ================= ADMIN ================= */

    getAdminAbout(): Observable<GeneralAbout> {
        return this.http.get<GeneralAbout>(`${this.baseUrl}/admin/about`);
    }

    saveAbout(formData: FormData) {
        return this.http.post(`${this.baseUrl}/admin/about`, formData);
    }
}
