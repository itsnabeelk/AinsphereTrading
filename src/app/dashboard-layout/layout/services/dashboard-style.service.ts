import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardStyleService {

    private links: HTMLLinkElement[] = [];

    load() {
        if (this.links.length) return;

        const styles = [
            '/dashboad-assets/css/bootstrap.min.css',
            '/dashboad-assets/css/icons.min.css',
            '/dashboad-assets/css/app.min.css'
        ];

        styles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
            this.links.push(link);
        });
    }

    remove() {
        this.links.forEach(link => document.head.removeChild(link));
        this.links = [];
    }
}
