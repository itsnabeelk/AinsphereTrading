import {
  Component,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';

declare function manJs(): void;
declare const Swiper: any;

@Component({
  selector: 'app-fmcg-home',
  imports: [RouterLink],
  templateUrl: './fmcg-home.html',
  styleUrl: './fmcg-home.css',
})
export class FmcgHome implements AfterViewInit, OnDestroy {

  private marqueeSwipers: any[] = [];
  private heroSwiper: any;
  private routerSub: any;

  // 🔒 IMPORTANT: prevent GSAP / ScrollSmoother re-init
  private manJsInitialized = false;

  constructor(private router: Router) { }

  ngAfterViewInit(): void {

    const initOnce = () => {
      // ✅ Run heavy global JS ONLY ONCE
      if (!this.manJsInitialized) {
        manJs();
        this.manJsInitialized = true;
      }

      // ✅ Safe Swiper init after DOM settles
      requestAnimationFrame(() => {
        this.initMarquee();
        this.initHeroSlider();
      });
    };

    // First load
    initOnce();

    // Router navigation
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // ❌ DO NOT call manJs again
        requestAnimationFrame(() => {
          this.initMarquee();
          this.initHeroSlider();
        });
      }
    });
  }

  /* =========================
     MARQUEE
  ========================= */
  initMarquee(): void {
    this.marqueeSwipers.forEach(s => s?.destroy?.(true, true));
    this.marqueeSwipers = [];

    if (typeof Swiper === 'undefined') return;

    document.querySelectorAll('.h5-maquee-slider').forEach(el => {
      const swiper = new Swiper(el, {
        slidesPerView: 'auto',
        loop: true,
        speed: 5000,
        spaceBetween: 30,
        allowTouchMove: false,
        autoplay: {
          delay: 1,
          disableOnInteraction: false,
        },
        breakpoints: {
          768: { spaceBetween: 35 },
          1024: { spaceBetween: 50 },
        }
      });

      this.marqueeSwipers.push(swiper);
    });
  }

  /* =========================
     HERO SLIDER
  ========================= */
  initHeroSlider(): void {
    if (this.heroSwiper) {
      this.heroSwiper.destroy(true, true);
      this.heroSwiper = null;
    }

    const el = document.querySelector('.h5-banner-slider') as HTMLElement;
    if (!el || typeof Swiper === 'undefined') return;

    this.heroSwiper = new Swiper(el, {
      slidesPerView: 1,
      loop: true,
      effect: 'fade',
      speed: 1400,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: false,
      }
    });
  }

  ngOnDestroy(): void {
    this.marqueeSwipers.forEach(s => s?.destroy?.(true, true));
    this.heroSwiper?.destroy?.(true, true);
    this.routerSub?.unsubscribe();
  }
}
