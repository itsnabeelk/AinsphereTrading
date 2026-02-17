import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { FmcgHomeService, FmcgHero, FmcgAbout, FmcgMarquee, FmcgClient } from '../../../service/fmcg-home.service';
import { CommonModule } from '@angular/common';
import { FmcgServicesService, FmcgService }
  from '../../../service/fmcg-services.service';
declare function manJs(): void;
declare const Swiper: any;

@Component({
  selector: 'app-fmcg-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './fmcg-home.html',
  styleUrl: './fmcg-home.css',
})
export class FmcgHome implements OnInit, AfterViewInit, OnDestroy {

  /* ================= CMS DATA ================= */

  heroSlides: FmcgHero[] = [];
  about: FmcgAbout | null = null;
  marqueeItems: FmcgMarquee[] = [];
  clients: FmcgClient[] = [];

  isArabic: boolean = false;
  services: FmcgService[] = [];
  /* ================= SWIPER ================= */

  private marqueeSwipers: any[] = [];
  private heroSwiper: any;
  private routerSub: any;
  private manJsInitialized = false;

  constructor(
    private router: Router,
    private fmcgService: FmcgHomeService,
    private fmcgServicesApi: FmcgServicesService

  ) { }

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.detectLanguage();
    this.loadAllSections();
    this.loadServices();
  }

  detectLanguage() {
    const lang = localStorage.getItem('lang');
    this.isArabic = lang === 'ar';
  }

  loadAllSections() {
    this.loadHero();
    this.loadAbout();
    this.loadMarquee();
    this.loadClients();
  }

  /* ================= LOAD DATA ================= */

  loadHero() {
    this.fmcgService.getHeroPublic().subscribe({
      next: (res) => {
        this.heroSlides = res;
        this.safeReInit();
      },
      error: (err) => console.error('Hero load error:', err)
    });
  }

  loadServices() {
    this.fmcgServicesApi.getListPage().subscribe({
      next: (res) => {
        this.services = (res?.services || [])
          .filter(s => s.is_active === 1);

        this.safeReInit();
      },
      error: (err) => console.error('Services load error:', err)
    });
  }


  loadAbout() {
    this.fmcgService.getAboutPublic().subscribe({
      next: (res) => {
        this.about = res;
      },
      error: (err) => console.error('About load error:', err)
    });
  }

  loadMarquee() {
    this.fmcgService.getMarqueePublic().subscribe({
      next: (res) => {
        this.marqueeItems = res;
        this.safeReInit();
      },
      error: (err) => console.error('Marquee load error:', err)
    });
  }

  loadClients() {
    this.fmcgService.getClientsPublic().subscribe({
      next: (res) => {
        this.clients = res;
        this.safeReInit();
      },
      error: (err) => console.error('Clients load error:', err)
    });
  }

  getImage(path: string): string {
    return this.fmcgService.getImage(path);
  }

  /* ================= SWIPER INIT ================= */

  ngAfterViewInit(): void {

    const initOnce = () => {
      if (!this.manJsInitialized) {
        manJs();
        this.manJsInitialized = true;
      }

      requestAnimationFrame(() => {
        this.initMarquee();
        this.initHeroSlider();
      });
    };

    initOnce();

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        requestAnimationFrame(() => {
          this.initMarquee();
          this.initHeroSlider();
        });
      }
    });
  }

  /* ================= SAFE REINIT ================= */

  private safeReInit() {
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.initMarquee();
        this.initHeroSlider();
      }, 0);
    });
  }


  /* ================= MARQUEE ================= */

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

  /* ================= HERO ================= */

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
        clickable: true,
      }

    });
  }

  /* ================= DESTROY ================= */

  ngOnDestroy(): void {
    this.marqueeSwipers.forEach(s => s?.destroy?.(true, true));
    this.heroSwiper?.destroy?.(true, true);
    this.routerSub?.unsubscribe();
  }

}
