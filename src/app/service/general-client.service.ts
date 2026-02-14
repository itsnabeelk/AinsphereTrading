import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface GeneralClient {
    id: number;
    name: string;
    logo: string;
    sort_order: number;
    is_active: number;
    created_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class GeneralClientService {

    private baseUrl = `${API_BASE_URL}/general/home`;

    constructor(private http: HttpClient) { }

    /* =========================
       PUBLIC
    ========================= */

    getPublicClients(): Observable<GeneralClient[]> {
        return this.http.get<GeneralClient[]>(`${this.baseUrl}/public/clients`);
    }

    /* =========================
       ADMIN
    ========================= */

    getAdminClients(): Observable<GeneralClient[]> {
        return this.http.get<GeneralClient[]>(`${this.baseUrl}/admin/clients`);
    }

    createClient(formData: FormData) {
        return this.http.post(`${this.baseUrl}/admin/clients`, formData);
    }

    deleteClient(id: number) {
        return this.http.delete(`${this.baseUrl}/admin/clients/${id}`);
    }

    toggleClient(id: number) {
        return this.http.put(`${this.baseUrl}/admin/clients/toggle/${id}`, {});
    }
    getImage(path: string): string {
        return `${API_BASE_URL}${path}`;
    }

    updateClient(id: number, formData: FormData) {
        return this.http.put(`${this.baseUrl}/admin/clients/${id}`, formData);
    }

}
