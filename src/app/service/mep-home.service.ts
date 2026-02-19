import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* ================= INTERFACES ================= */

export interface MepHero {
    id?: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    image: string;
}

export interface MepAbout {
    id?: number;
    sub_title_en: string;
    sub_title_ar: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    image: string;
}

export interface MepWorking {
    id?: number;
    step_number: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    sort_order: number;
}

export interface MepClient {
    id?: number;
    image: string;
    sort_order: number;
}

/* ================= SERVICE ================= */
@Injectable({
    providedIn: 'root'
})
export class MepHomeService {

    private baseUrl = `${API_BASE_URL}/mep/home`;

    constructor(private http: HttpClient) { }

    /* ================= HERO ================= */

    getHeroPublic() {
        return this.http.get<MepHero>(`${this.baseUrl}/hero/public`);
    }

    getHeroAdmin() {
        return this.http.get<MepHero>(`${this.baseUrl}/hero/admin`);
    }

    saveHero(formData: FormData) {
        return this.http.post(`${this.baseUrl}/hero/save`, formData);
    }

    /* ================= ABOUT ================= */

    getAboutPublic() {
        return this.http.get<MepAbout>(`${this.baseUrl}/about/public`);
    }

    getAboutAdmin() {
        return this.http.get<MepAbout>(`${this.baseUrl}/about/admin`);
    }

    saveAbout(formData: FormData) {
        return this.http.post(`${this.baseUrl}/about/save`, formData);
    }

    /* ================= WORKING ================= */

    getWorkingPublic() {
        return this.http.get<MepWorking[]>(`${this.baseUrl}/working/public`);
    }

    getWorkingAdmin() {
        return this.http.get<MepWorking[]>(`${this.baseUrl}/working/admin`);
    }

    createWorking(data: any) {
        return this.http.post(`${this.baseUrl}/working/create`, data);
    }

    updateWorking(id: number, data: any) {
        return this.http.put(`${this.baseUrl}/working/update/${id}`, data);
    }

    deleteWorking(id: number) {
        return this.http.delete(`${this.baseUrl}/working/${id}`);
    }

    /* ================= CLIENT ================= */

    getClientsPublic() {
        return this.http.get<MepClient[]>(`${this.baseUrl}/clients/public`);
    }

    getClientsAdmin() {
        return this.http.get<MepClient[]>(`${this.baseUrl}/clients/admin`);
    }

    createClient(formData: FormData) {
        return this.http.post(`${this.baseUrl}/clients/create`, formData);
    }

    updateClient(id: number, formData: FormData) {
        return this.http.put(`${this.baseUrl}/clients/update/${id}`, formData);
    }

    deleteClient(id: number) {
        return this.http.delete(`${this.baseUrl}/clients/${id}`);
    }

    /* ================= IMAGE ================= */

    getImage(path: string | null): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    }
}
