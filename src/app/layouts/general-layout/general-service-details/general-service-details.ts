import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  GeneralServiceDetailService,
  GeneralServiceDetailResponse
} from '../../../service/general-service-detail.service';

declare function manJs(): void;

@Component({
  selector: 'app-general-service-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './general-service-details.html',
  styleUrl: './general-service-details.css'
})
export class GeneralServiceDetails implements OnInit {

  data: GeneralServiceDetailResponse | null = null;
  slug: string = '';
  loading = true;

  currentLang: 'en' | 'ar' = 'en';

  constructor(
    private route: ActivatedRoute,
    private serviceApi: GeneralServiceDetailService
  ) { }

  ngOnInit(): void {

    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'ar' || savedLang === 'en') {
      this.currentLang = savedLang;
    }

    this.slug = this.route.snapshot.paramMap.get('slug') || '';

    if (this.slug) {
      this.loadService();
    } else {
      this.loading = false;
    }
  }

  loadService() {
    this.serviceApi.getBySlug(this.slug).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        setTimeout(() => manJs(), 200);
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
