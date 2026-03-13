import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FmcgServicesService, FmcgService } from '../../../service/fmcg-services.service';

declare function manJs(): void;

@Component({
  selector: 'app-fmcg-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fmcg-services.html',
  styleUrl: './fmcg-services.css',
})
export class FmcgServices implements OnInit, AfterViewInit {

  currentLang: 'en' | 'ar' = 'en';
  breadcrumbTitleEn = 'Our Products ';
  breadcrumbTitleAr = 'منتجاتنا';

  services: FmcgService[] = [];
  loading = true;

  constructor(private serviceApi: FmcgServicesService) { }

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
        this.loading = false;

        setTimeout(() => manJs(), 300);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getImage(path: string | null): string {
    return this.serviceApi.getImage(path);
  }

}
