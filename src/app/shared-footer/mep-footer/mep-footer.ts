import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterSettingsService, FooterSettings } from '../../service/footer-settings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mep-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './mep-footer.html',
  styleUrl: './mep-footer.css',
})
export class MEPFooter implements OnInit {
  currentLang: 'en' | 'ar' = 'en';
  settings: FooterSettings | null = null;

  constructor(private footerService: FooterSettingsService) {}

  ngOnInit() {
    const saved = localStorage.getItem('lang');
    this.currentLang = (saved as 'en' | 'ar') || 'en';

    this.footerService.getFooterSettings('mep').subscribe({
      next: (data) => {
        this.settings = data;
      },
      error: (err) => console.error('Error fetching mep footer settings:', err)
    });
  }

}