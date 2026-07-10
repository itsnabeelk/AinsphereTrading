import { Component, HostListener, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-fmcg',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-fmcg.html',
  styleUrl: './header-fmcg.css',
})
export class HeaderFMCG implements OnInit, OnDestroy {

  currentLang: 'en' | 'ar' = 'en';
  isSticky = false;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    this.currentLang = lang === 'ar' ? 'ar' : 'en';

    // ensure correct direction on load
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.updateStickyState();

    // Relocate header to body for ScrollSmoother fixed compatibility
    document.body.appendChild(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.el.nativeElement.parentNode) {
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    }
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
