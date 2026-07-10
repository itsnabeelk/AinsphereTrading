import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface FooterSettings {
    footer_type: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    linkedin_url: string;
    email: string;
    phone: string;
    location_en: string;
    location_ar: string;
}

@Injectable({
    providedIn: 'root'
})
export class FooterSettingsService {
    private baseUrl = `${API_BASE_URL}/footer-settings`;

    constructor(private http: HttpClient) { }

    getFooterSettings(type: string): Observable<FooterSettings> {
        return this.http.get<FooterSettings>(`${this.baseUrl}/${type}`);
    }

    updateFooterSettings(type: string, settings: Partial<FooterSettings>): Observable<any> {
        return this.http.put(`${this.baseUrl}/${type}`, settings);
    }
}
