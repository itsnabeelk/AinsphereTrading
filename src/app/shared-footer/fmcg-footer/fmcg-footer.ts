import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterSettingsService, FooterSettings } from '../../service/footer-settings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fmcg-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './fmcg-footer.html',
  styleUrl: './fmcg-footer.css',
})
export class FMCGFooter implements OnInit {

  isArabic: boolean = false;
  settings: FooterSettings | null = null;

  constructor(private footerService: FooterSettingsService) {}

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    this.isArabic = lang === 'ar';

    this.footerService.getFooterSettings('fmcg').subscribe({
      next: (data) => {
        this.settings = data;
      },
      error: (err) => console.error('Error fetching fmcg footer settings:', err)
    });
  }

}