import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FooterSettingsService, FooterSettings } from '../../service/footer-settings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './general-footer.html',
  styleUrl: './general-footer.css',
})
export class GeneralFooter implements OnInit {

  currentLang: 'en' | 'ar' = 'en';
  settings: FooterSettings | null = null;

  constructor(private footerService: FooterSettingsService) {}

  ngOnInit(): void {

    const savedLang = localStorage.getItem('lang');

    if (savedLang === 'ar' || savedLang === 'en') {
      this.currentLang = savedLang;
    } else {
      this.currentLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    }

    this.footerService.getFooterSettings('general').subscribe({
      next: (data) => {
        this.settings = data;
      },
      error: (err) => console.error('Error fetching general footer settings:', err)
    });

  }

}