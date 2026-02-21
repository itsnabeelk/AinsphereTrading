import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

/* ================= INTERFACES ================= */

export interface ContactPayload {
    name: string;
    email: string;
    phone: string;
    subject?: string;
    message: string;
}

export interface ContactResponse {
    message: string;
}

/* ================= SERVICE ================= */

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    private baseUrl = `${API_BASE_URL}/contact`;

    constructor(private http: HttpClient) { }

    /* ================= SEND CONTACT ================= */

    sendContact(data: ContactPayload): Observable<ContactResponse> {
        return this.http.post<ContactResponse>(`${this.baseUrl}/send`, data);
    }
}