import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UniformServiceDetailService } from '../../../service/uniform-service-detail.service';

declare function manJs(): void;

@Component({
  selector: 'app-uniform-service-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './uniform-service-details.html',
  styleUrl: './uniform-service-details.css',
})
export class UniformServiceDetails implements OnInit {

  data: any = null;
  loading = true;

  currentLang = localStorage.getItem('lang') || 'en';

  constructor(
    private route: ActivatedRoute,
    private api: UniformServiceDetailService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) this.loadData(slug);
    });
  }

  /* ================= LOAD DATA ================= */
  loadData(slug: string) {
    this.loading = true;

    this.api.getBySlug(slug).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;

        setTimeout(() => {
          if (typeof manJs === 'function') {
            manJs();
          }
        }, 100);
      },
      error: (err) => {
        console.error('Detail load error:', err);
        this.loading = false;
      }
    });
  }

  /* ================= IMAGE ================= */
  getImage(path: string | null): string {
    return this.api.getImage(path);
  }
}