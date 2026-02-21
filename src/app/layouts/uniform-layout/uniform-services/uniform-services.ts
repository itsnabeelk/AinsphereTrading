import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UniformServicesService, UniformService } from '../../../service/uniform-services.service';

declare function manJs(): void;

@Component({
  selector: 'app-uniform-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './uniform-services.html',
  styleUrl: './uniform-services.css',
})
export class UniformServices implements OnInit {

  services: UniformService[] = [];
  loading = true;

  isArabic = localStorage.getItem('lang') === 'ar';

  constructor(private serviceApi: UniformServicesService) { }

  ngOnInit(): void {
    this.loadServices();
  }

  /* ================= LOAD ================= */
  loadServices(): void {
    this.loading = true;

    this.serviceApi.getPublic().subscribe({
      next: (res) => {
        this.services = res || [];
        this.loading = false;

        // ✅ Ensure DOM rendered before animation
        setTimeout(() => {
          if (typeof manJs === 'function') {
            manJs();
          }
        }, 100);
      },
      error: (err) => {
        console.error('Uniform services load error:', err);
        this.loading = false;
      }
    });
  }

  /* ================= IMAGE ================= */
  getImage(path?: string | null): string {
    return this.serviceApi.getImage(path);
  }
}