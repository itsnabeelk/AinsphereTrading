import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-mep',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-mep.html',
  styleUrl: './header-mep.css',
})
export class HeaderMEP implements OnInit {

  currentLang: 'en' | 'ar' = 'en';
  isSticky = false;

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    this.currentLang = lang === 'ar' ? 'ar' : 'en';

    // ensure direction is correct on load
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.updateStickyState();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateStickyState();
  }

  private updateStickyState(): void {
    this.isSticky = window.scrollY > 20;
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
