import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UniformHomeService } from '../../../service/uniform-home.service';
import { UniformServicesService, UniformService } from '../../../service/uniform-services.service';
declare function manJs(): void;
declare const Swiper: any;

@Component({
  selector: 'app-uniform-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './uniform-home.html',
  styleUrl: './uniform-home.css',
})
export class UniformHome implements OnInit, AfterViewInit, OnDestroy {

  /* ================= CMS DATA ================= */

  heroSlides: any[] = [];
  about: any = null;
  clients: any[] = [];
  working: any[] = [];
  mission: any = null;

  isArabic: boolean = false;
  uniformServices: UniformService[] = [];
  /* ================= SWIPER ================= */

  private heroSwiper: any;
  private clientSwiper: any;
  private routerSub: any;
  private manJsInitialized = false;
  private mainHeroSwiper: any;
  constructor(
    private router: Router,
    private api: UniformHomeService,
    private uniformServiceApi: UniformServicesService
  ) { }

  /* ================= INIT ================= */

  currentLang: 'en' | 'ar' = 'en';


  ngOnInit(): void {
    this.detectLanguage();
    this.loadAllSections();
    this.loadUniformServices();
    const saved = localStorage.getItem('lang');
    this.currentLang = (saved as 'en' | 'ar') || 'en';
  }

  detectLanguage() {
    const lang = localStorage.getItem('lang');
    this.isArabic = lang === 'ar';
    window.addEventListener('storage', () => {
      this.detectLanguage();
    });
  }

  loadAllSections() {
    this.loadHero();
    this.loadAbout();
    this.loadClients();
    this.loadWorking();
    this.loadMission();
  }

  /* ================= LOAD DATA ================= */

  loadHero() {
    this.api.getHeroPublic().subscribe({
      next: (res) => {
        this.heroSlides = res || [];

        setTimeout(() => {
          this.initMainHeroSlider(); // ✅ VERY IMPORTANT
        }, 0);
      }
    });
  }

  loadAbout() {
    this.api.getAboutPublic().subscribe({
      next: (res) => {
        this.about = res;
      },
      error: (err) => console.error('About load error:', err)
    });
  }

  loadClients() {
    this.api.getClientsPublic().subscribe({
      next: (res) => {
        this.clients = (res || []).filter(c => c.is_active === 1);
        this.safeReInit();
      },
      error: (err) => console.error('Clients load error:', err)
    });
  }

  loadWorking() {
    this.api.getWorkingPublic().subscribe({
      next: (res) => {
        this.working = (res || [])
          .filter(w => w.is_active === 1)
          .sort((a, b) => a.sort_order - b.sort_order);
      },
      error: (err) => console.error('Working load error:', err)
    });
  }

  loadMission() {
    this.api.getMissionPublic().subscribe({
      next: (res) => {
        if (!res) return;

        this.mission = {
          ...res,

          // 🔥 normalize fields (VERY IMPORTANT)
          vision_desc_en: res.vision_desc_en || '',
          vision_desc_ar: res.vision_desc_ar || '',
          mission_desc_en: res.mission_desc_en || '',
          mission_desc_ar: res.mission_desc_ar || ''
        };
      },
      error: (err) => console.error('Mission load error:', err)
    });
  }

  getImage(path: string | null): string {
    return this.api.getImage(path);
  }

  /* ================= VIEW INIT ================= */

  ngAfterViewInit(): void {

    const initOnce = () => {
      if (!this.manJsInitialized) {
        manJs();
        this.manJsInitialized = true;
      }

      requestAnimationFrame(() => {
        this.initHeroSlider();
        this.initClientSlider();
        this.initMainHeroSlider();
      });
    };

    initOnce();

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        requestAnimationFrame(() => {
          this.initHeroSlider();
          this.initClientSlider();
        });
      }
    });
  }

  /* ================= SAFE REINIT ================= */

  private safeReInit() {
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.initHeroSlider();
        this.initClientSlider();
        this.initMainHeroSlider();
      }, 0);
    });
  }

  /* ================= HERO SWIPER ================= */

  initHeroSlider(): void {

    if (this.heroSwiper) {
      this.heroSwiper.destroy(true, true);
      this.heroSwiper = null;
    }

    const el = document.querySelector('.h6-hero-card-slider') as HTMLElement;
    if (!el || typeof Swiper === 'undefined') return;

    this.heroSwiper = new Swiper(el, {
      slidesPerView: 1,
      loop: true,
      speed: 1200,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true,
      }
    });
  }

  /* ================= CLIENT SWIPER ================= */

  initClientSlider(): void {

    if (this.clientSwiper) {
      this.clientSwiper.destroy(true, true);
      this.clientSwiper = null;
    }

    const el = document.querySelector('.h6-client-slider') as HTMLElement;
    if (!el || typeof Swiper === 'undefined') return;

    this.clientSwiper = new Swiper(el, {
      slidesPerView: 'auto', // 👈 IMPORTANT
      spaceBetween: 40,
      loop: true,
      speed: 4000, // 👈 controls smooth flow (higher = slower smooth)
      allowTouchMove: false, // 👈 optional (disable drag)

      autoplay: {
        delay: 0, // 👈 KEY: continuous movement
        disableOnInteraction: false,
      },

      freeMode: true, // 👈 IMPORTANT
      freeModeMomentum: false, // 👈 smooth constant speed

      breakpoints: {
        768: { spaceBetween: 60 },
        1024: { spaceBetween: 80 }
      }
    });
  }

  /* ================= DESTROY ================= */

  ngOnDestroy(): void {
    this.heroSwiper?.destroy?.(true, true);
    this.clientSwiper?.destroy?.(true, true);
    this.routerSub?.unsubscribe();
  }



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


  loadUniformServices() {
    this.uniformServiceApi.getPublic().subscribe({
      next: (res) => {
        const active = (res || []).filter(s => s.is_active === 1);

        let duplicated: UniformService[] = [];

        // 🔥 Ensure minimum 6–8 slides ALWAYS
        if (active.length > 0) {
          while (duplicated.length < 8) {
            duplicated = [...duplicated, ...active];
          }
        }

        this.uniformServices = duplicated;

        this.safeReInit();
      },
      error: (err) => console.error('Uniform services error:', err)
    });
  }
  getServiceImage(path: string | null): string {
    return this.uniformServiceApi.getImage(path);
  }

  getFile(path: string | null): string {
    return this.api.getFile(path);
  }
}