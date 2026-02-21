import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-general',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-general.html',
  styleUrl: './header-general.css',
})
export class HeaderGeneral implements OnInit {

  currentLang: 'en' | 'ar' = 'en';

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    this.currentLang = lang === 'ar' ? 'ar' : 'en';

    // ensure correct direction on load
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  closeHamburger(): void {
    document.querySelector('.hamburger-area')?.classList.remove('opened');
    document.querySelector('.body-overlay')?.classList.remove('opened');
    document.body.classList.remove('overflow-hidden');
  }

  setLanguage(lang: 'en' | 'ar'): void {
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    window.location.reload();
  }

}