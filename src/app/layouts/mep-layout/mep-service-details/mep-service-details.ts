import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MepServiceDetailService }
  from '../../../service/mep-service-detail.service';


declare function manJs(): void;

@Component({
  selector: 'app-mep-service-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mep-service-details.html',
  styleUrl: './mep-service-details.css',
})
export class MepServiceDetails implements OnInit {

  data: any = null;
  slug: string = '';
  loading = true;

  currentLang: 'en' | 'ar' = 'en';

  constructor(
    private route: ActivatedRoute,
    private serviceApi: MepServiceDetailService
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
