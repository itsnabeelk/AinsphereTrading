import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterSettingsService, FooterSettings } from '../../service/footer-settings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uniforms-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './uniforms-footer.html',
  styleUrl: './uniforms-footer.css',
})
export class UNIFORMSFooter implements OnInit {
  currentLang: 'en' | 'ar' = 'en';
  settings: FooterSettings | null = null;

  constructor(private footerService: FooterSettingsService) {}

  ngOnInit() {
    const saved = localStorage.getItem('lang');
    this.currentLang = (saved as 'en' | 'ar') || 'en';

    this.footerService.getFooterSettings('uniform').subscribe({
      next: (data) => {
        this.settings = data;
      },
      error: (err) => console.error('Error fetching uniforms footer settings:', err)
    });
  }

}
