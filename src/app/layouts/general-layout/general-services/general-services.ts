import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GeneralServicesService, GeneralService } from '../../../service/general-services.service';
import { API_BASE_URL } from '../../../core/api.config';

declare function manJs(): void;

@Component({
  selector: 'app-general-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './general-services.html',
  styleUrl: './general-services.css'
})
export class GeneralServices implements OnInit, AfterViewInit {

  currentLang: 'en' | 'ar' = 'en';

  breadcrumbTitleEn = 'General Services';
  breadcrumbTitleAr = 'الخدمات العامة';

  services: GeneralService[] = [];

  constructor(private serviceApi: GeneralServicesService) { }

  ngOnInit(): void {

    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'ar' || savedLang === 'en') {
      this.currentLang = savedLang;
    }

    this.loadPage();
  }

  ngAfterViewInit(): void {
    setTimeout(() => manJs(), 200);
  }

  loadPage() {
    this.serviceApi.getListPage().subscribe({
      next: (res) => {

        if (res.page) {
          this.breadcrumbTitleEn = res.page.breadcrumb_title_en || this.breadcrumbTitleEn;
          this.breadcrumbTitleAr = res.page.breadcrumb_title_ar || this.breadcrumbTitleAr;
        }

        this.services = res.services || [];

        setTimeout(() => manJs(), 300);
      }
    });
  }

  getImage(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  }

  setLanguage(lang: 'en' | 'ar') {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
  }

}
