import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.config';

@Injectable({
    providedIn: 'root'
})
export class UniformHomeService {

    private baseUrl = `${API_BASE_URL}/uniform/home`;

    constructor(private http: HttpClient) { }

    /* ================= HERO ================= */

    getHeroPublic() {
        return this.http.get<any[]>(`${this.baseUrl}/hero/public`);
    }

    getHeroAdmin() {
        return this.http.get<any[]>(`${this.baseUrl}/hero/admin`);
    }

    saveHero(data: FormData) {
        return this.http.post(`${this.baseUrl}/hero/save`, data);
    }

    deleteHero(id: number) {
        return this.http.delete(`${this.baseUrl}/hero/${id}`);
    }

    /* ================= ABOUT ================= */

    getAboutPublic() {
        return this.http.get<any>(`${this.baseUrl}/about/public`);
    }

    getAboutAdmin() {
        return this.http.get<any>(`${this.baseUrl}/about/admin`);
    }

    saveAbout(data: FormData) {
        return this.http.post(`${this.baseUrl}/about/save`, data);
    }

    /* ================= CLIENT ================= */

    getClientsPublic() {
        return this.http.get<any[]>(`${this.baseUrl}/clients/public`);
    }

    getClientsAdmin() {
        return this.http.get<any[]>(`${this.baseUrl}/clients/admin`);
    }

    createClient(data: FormData) {
        return this.http.post(`${this.baseUrl}/clients/create`, data);
    }

    updateClient(id: number, data: FormData) {
        return this.http.put(`${this.baseUrl}/clients/update/${id}`, data);
    }

    deleteClient(id: number) {
        return this.http.delete(`${this.baseUrl}/clients/${id}`);
    }

    /* ================= WORKING ================= */

    getWorkingPublic() {
        return this.http.get<any[]>(`${this.baseUrl}/working/public`);
    }

    getWorkingAdmin() {
        return this.http.get<any[]>(`${this.baseUrl}/working/admin`);
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

    /* ================= MISSION ================= */

    getMissionPublic() {
        return this.http.get<any>(`${this.baseUrl}/mission/public`);
    }

    getMissionAdmin() {
        return this.http.get<any>(`${this.baseUrl}/mission/admin`);
    }

    saveMission(data: FormData) {
        return this.http.post(`${this.baseUrl}/mission/save`, data);
    }

    /* ================= IMAGE HELPER ================= */

    getImage(path: string | null): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
    }

    getFile(path: string | null): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
    }

    toggleHeroStatus(id: number, status: number) {
        return this.http.put(`${this.baseUrl}/hero/status/${id}`, {
            is_active: status
        });
    }

}