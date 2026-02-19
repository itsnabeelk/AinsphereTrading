import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MepServicesService, MepService } from '../../../service/mep-services.service';

declare function manJs(): void;

@Component({
  selector: 'app-mep-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mep-services.html',
  styleUrl: './mep-services.css',
})
export class MepServices implements OnInit {

  services: MepService[] = [];
  currentLang: 'en' | 'ar' = 'en';
  loading = true;

  constructor(private api: MepServicesService) { }

  ngOnInit(): void {

    const lang = localStorage.getItem('lang');
    if (lang === 'ar' || lang === 'en') {
      this.currentLang = lang;
    }

    this.loadServices();
  }

  loadServices(): void {
    this.api.getPublic().subscribe({
      next: (res) => {
        this.services = res || [];
        this.loading = false;

        // run animation after DOM update
        setTimeout(() => {
          if (typeof manJs === 'function') {
            manJs();
          }
        }, 300);
      },
      error: (err) => {
        console.error('Failed to load MEP services:', err);
        this.loading = false;
      }
    });
  }

  getImage(path?: string | null): string {
    return this.api.getImage(path);
  }
}
