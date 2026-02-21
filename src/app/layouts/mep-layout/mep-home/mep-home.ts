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

  // ✅ CHANGE: hero -> heroSlides
  heroSlides: MepHero[] = [];

  about: MepAbout | null = null;
  working: MepWorking[] = [];
  clients: MepClient[] = [];
  services: any[] = [];

  private mainHeroSwiper: any;
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

    // ✅ init once after view
    requestAnimationFrame(() => this.initMainHeroSlider());

    // ✅ re-init after route navigation (same idea as Uniform)
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        requestAnimationFrame(() => this.initMainHeroSlider());
      }
    });
  }

  loadData() {

    // ✅ IMPORTANT: supports backend returning SINGLE hero or ARRAY
    this.api.getHeroPublic().subscribe((res: any) => {
      this.heroSlides = res
        ? (Array.isArray(res) ? res : [res])
        : [];

      // ✅ init after data is rendered
      setTimeout(() => this.initMainHeroSlider(), 0);
    });

    this.api.getAboutPublic().subscribe((res: any) => this.about = res);
    this.api.getWorkingPublic().subscribe((res: any[]) => this.working = res);
    this.api.getClientsPublic().subscribe((res: any[]) => this.clients = res);

    this.serviceApi.getPublic().subscribe((res: any[]) => {
      this.services = res?.filter(s => s.is_active == 1) || [];
    });
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

  getImage(path: string | null): string {
    return this.api.getImage(path);
  }

  getFile(path: string | null): string {
    return this.api.getFile(path);
  }

  ngOnDestroy(): void {
    this.mainHeroSwiper?.destroy?.(true, true);
    this.routerSub?.unsubscribe();
  }
}