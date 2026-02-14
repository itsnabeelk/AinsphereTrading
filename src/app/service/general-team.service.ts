import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface GeneralTeam {
    id: number;
    name_en: string;
    name_ar: string;
    designation_en: string;
    designation_ar: string;
    image: string;
    sort_order: number;
    is_active: number;
}

@Injectable({ providedIn: 'root' })
export class GeneralTeamService {

    private baseUrl = `${API_BASE_URL}/general/home`;

    constructor(private http: HttpClient) { }

    getPublicTeam(): Observable<GeneralTeam[]> {
        return this.http.get<GeneralTeam[]>(`${this.baseUrl}/public/team`);
    }

    getAdminTeam(): Observable<GeneralTeam[]> {
        return this.http.get<GeneralTeam[]>(`${this.baseUrl}/admin/team`);
    }

    createTeam(formData: FormData) {
        return this.http.post(`${this.baseUrl}/admin/team`, formData);
    }

    updateTeam(id: number, formData: FormData) {
        return this.http.put(`${this.baseUrl}/admin/team/${id}`, formData);
    }

    deleteTeam(id: number) {
        return this.http.delete(`${this.baseUrl}/admin/team/${id}`);
    }

    toggleTeam(id: number) {
        return this.http.put(`${this.baseUrl}/admin/team/toggle/${id}`, {});
    }
}
