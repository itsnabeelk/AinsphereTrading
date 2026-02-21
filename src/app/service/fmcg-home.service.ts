import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* =========================================================
   INTERFACES
========================================================= */

/* ================= HERO ================= */

export interface FmcgHero {
    id?: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    button_text_en: string;
    button_text_ar: string;
    button_link: string;
    image: string;
    sort_order: number;
    is_active: number;
}

/* ================= ABOUT ================= */

export interface FmcgAbout {
    id?: number;
    sub_title_en: string;
    sub_title_ar: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    funfact_1_number: string;
    funfact_1_suffix: string;
    funfact_1_text_en: string;
    funfact_1_text_ar: string;
    funfact_2_number: string;
    funfact_2_suffix: string;
    funfact_2_text_en: string;
    funfact_2_text_ar: string;
    image: string;
    brochure_en: string;
    brochure_ar: string;
    is_active: number;
}

/* ================= MARQUEE ================= */

export interface FmcgMarquee {
    id?: number;
    title_en: string;
    title_ar: string;
    sort_order: number;
    is_active: number;
}

/* ================= CLIENT ================= */

export interface FmcgClient {
    id?: number;
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
export class FmcgHomeService {

    private baseUrl = `${API_BASE_URL}/fmcg/home`;

    constructor(private http: HttpClient) { }

    /* =========================================================
       HERO
    ========================================================= */

    getHeroPublic(): Observable<FmcgHero[]> {
        return this.http.get<FmcgHero[]>(`${this.baseUrl}/hero/public`);
    }

    getHeroAdmin(): Observable<FmcgHero[]> {
        return this.http.get<FmcgHero[]>(`${this.baseUrl}/hero/admin`);
    }

    saveHero(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/hero/save`, formData);
    }

    deleteHero(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/hero/${id}`);
    }

    /* =========================================================
       ABOUT
    ========================================================= */

    getAboutPublic(): Observable<FmcgAbout> {
        return this.http.get<FmcgAbout>(`${this.baseUrl}/about/public`);
    }

    getAboutAdmin(): Observable<FmcgAbout> {
        return this.http.get<FmcgAbout>(`${this.baseUrl}/about/admin`);
    }

    saveAbout(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/about/save`, formData);
    }

    /* =========================================================
       MARQUEE
    ========================================================= */

    getMarqueePublic(): Observable<FmcgMarquee[]> {
        return this.http.get<FmcgMarquee[]>(`${this.baseUrl}/marquee/public`);
    }

    getMarqueeAdmin(): Observable<FmcgMarquee[]> {
        return this.http.get<FmcgMarquee[]>(`${this.baseUrl}/marquee/admin`);
    }

    createMarquee(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/marquee/create`, payload);
    }

    updateMarquee(id: number, payload: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/marquee/update/${id}`, payload);
    }

    deleteMarquee(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/marquee/${id}`);
    }

    /* =========================================================
       CLIENTS
    ========================================================= */

    getClientsPublic(): Observable<FmcgClient[]> {
        return this.http.get<FmcgClient[]>(`${this.baseUrl}/clients/public`);
    }

    getClientsAdmin(): Observable<FmcgClient[]> {
        return this.http.get<FmcgClient[]>(`${this.baseUrl}/clients/admin`);
    }

    createClient(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/clients/create`, formData);
    }

    updateClient(id: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}/clients/update/${id}`, formData);
    }

    deleteClient(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/clients/${id}`);
    }

    /* =========================================================
       IMAGE HELPER
    ========================================================= */

    getImage(path: string | null): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    }

}
