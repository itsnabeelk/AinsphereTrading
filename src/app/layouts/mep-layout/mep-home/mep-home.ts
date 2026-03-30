import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MepHomeService,
  MepHero,
  MepAbout,
  MepWorking,
  MepClient
} from '../../../service/mep-home.service';
import { MepServicesService } from '../../../service/mep-services.service';

declare function manJs(): void;
declare const Swiper: any;

@Component({
  selector: 'app-mep-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './mep-home.html',
  styleUrl: './mep-home.css',
})
export class MepHome implements OnInit, AfterViewInit, OnDestroy {

  currentLang: 'en' | 'ar' = 'en';

  heroSlides: MepHero[] = [];
  about: MepAbout | null = null;
  working: MepWorking[] = [];
  clients: MepClient[] = [];
  services: any[] = [];

  private mainHeroSwiper: any;
  private clientSwiper: any;
  private projectSwiper: any;
  private routerSub: any;
  private manJsInitialized = false;

  constructor(
    private router: Router,
    private api: MepHomeService,
    private serviceApi: MepServicesService
  ) { }

  ngOnInit(): void {

    const lang = localStorage.getItem('lang');
    if (lang === 'ar' || lang === 'en') {
      this.currentLang = lang;
    }

    this.loadData();
  }

  ngAfterViewInit(): void {

    if (!this.manJsInitialized) {
      manJs();
      this.manJsInitialized = true;
    }

    requestAnimationFrame(() => {
      this.initMainHeroSlider();
      this.initClientSlider();
      this.initProjectSlider();
    });

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        requestAnimationFrame(() => {
          this.initMainHeroSlider();
          this.initClientSlider();
        });
      }
    });
  }

  loadData() {

    this.api.getHeroPublic().subscribe((res: any) => {

      this.heroSlides = res
        ? (Array.isArray(res) ? res : [res])
        : [];

      setTimeout(() => this.initMainHeroSlider(), 0);
    });

    this.api.getAboutPublic().subscribe(res => this.about = res);
    this.api.getWorkingPublic().subscribe(res => this.working = res);

    this.api.getClientsPublic().subscribe((res: any[]) => {
      this.clients = res;

      // initialize client slider after DOM render
      setTimeout(() => this.initClientSlider(), 0);
    });

    this.serviceApi.getPublic().subscribe((res: any[]) => {
      this.services = res?.filter(s => s.is_active == 1) || [];

      setTimeout(() => this.initProjectSlider(), 0);
    });
  }

  /* ================= HERO SLIDER ================= */

  initMainHeroSlider(): void {

    if (this.mainHeroSwiper) {
      this.mainHeroSwiper.destroy(true, true);
      this.mainHeroSwiper = null;
    }

    const el = document.querySelector('.main-hero-slider') as HTMLElement;
    if (!el || typeof Swiper === 'undefined') return;

    this.mainHeroSwiper = new Swiper(el, {
      slidesPerView: 1,
      loop: true,
      speed: 1200,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      }
    });
  }

  /* ================= CLIENT SLIDER ================= */

  initClientSlider(): void {

    if (this.clientSwiper) {
      this.clientSwiper.destroy(true, true);
      this.clientSwiper = null;
    }

    const el = document.querySelector('.h6-client-slider') as HTMLElement;
    if (!el || typeof Swiper === 'undefined') return;

    this.clientSwiper = new Swiper(el, {
      slidesPerView: 'auto',
      spaceBetween: 40,
      loop: true,
      speed: 4000,
      allowTouchMove: false,

      autoplay: {
        delay: 0,
        disableOnInteraction: false
      },

      freeMode: true,
      freeModeMomentum: false,

      breakpoints: {
        768: { spaceBetween: 60 },
        1024: { spaceBetween: 80 }
      }
    });
  }


  /* ================= PROJECT SLIDER ================= */

  initProjectSlider(): void {

    if (this.projectSwiper) {
      this.projectSwiper.destroy(true, true);
      this.projectSwiper = null;
    }

    const el = document.querySelector('.project-slider-2') as HTMLElement;
    if (!el || typeof Swiper === 'undefined') return;

    this.projectSwiper = new Swiper(el, {

      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      speed: 1200,

      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },

      navigation: {
        nextEl: '.slider-next',
        prevEl: '.slider-prev'
      },

      pagination: {
        el: el.querySelector('.swiper-pagination-area'),
        clickable: true
      },

      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }

    });

  }

  getImage(path: string | null): string {
    return this.api.getImage(path);
  }

  getFile(path: string | null): string {
    return this.api.getFile(path);
  }

  ngOnDestroy(): void {
    this.mainHeroSwiper?.destroy?.(true, true);
    this.clientSwiper?.destroy?.(true, true);
    this.projectSwiper?.destroy?.(true, true);
    this.routerSub?.unsubscribe();
  }
}
