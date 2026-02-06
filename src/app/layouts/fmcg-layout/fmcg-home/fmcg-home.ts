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

  constructor(private router: Router) { }

  ngAfterViewInit(): void {
    const init = () => {
      manJs();

      requestAnimationFrame(() => {
        this.initMarquee();
        this.initHeroSlider();
      });
    };

    init();

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        init();
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
    this.heroSwiper?.destroy?.(true, true);

    const el = document.querySelector('.h5-banner-slider');
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
