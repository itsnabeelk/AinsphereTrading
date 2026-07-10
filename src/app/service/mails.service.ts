import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface ContactSubmission {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    created_at: string;
}

export interface CareerApplication {
    id: number;
    name: string;
    email: string;
    phone: string;
    job_title: string;
    message: string;
    cv_path: string;
    created_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class MailsService {
    private baseUrl = `${API_BASE_URL}/mails`;

    constructor(private http: HttpClient) { }

    getContacts(): Observable<ContactSubmission[]> {
        return this.http.get<ContactSubmission[]>(`${this.baseUrl}/contacts`);
    }

    deleteContact(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/contacts/${id}`);
    }

    getCareers(): Observable<CareerApplication[]> {
        return this.http.get<CareerApplication[]>(`${this.baseUrl}/careers`);
    }

    deleteCareer(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/careers/${id}`);
    }
}
