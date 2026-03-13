import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

import { GeneralHomeService, GeneralHero } from '../../../service/general-home.service';
import { GeneralClientService, GeneralClient } from '../../../service/general-client.service';
import { GeneralAboutService, GeneralAbout } from '../../../service/general-about.service';
import { GeneralWorkingService, GeneralWorking } from '../../../service/general-working.service';
import { GeneralTeamService, GeneralTeam } from '../../../service/general-team.service';
import { GeneralServicesService, GeneralService }
  from '../../../service/general-services.service';

import { API_BASE_URL } from '../../../core/api.config';

declare function manJs(): void;

@Component({
  selector: 'app-general-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './general-home.html',
  styleUrl: './general-home.css',
})
export class GeneralHome implements OnInit, AfterViewInit {

  currentLang: 'en' | 'ar' = 'en';

  heroes: GeneralHero[] = [];
  clients: GeneralClient[] = [];
  about: GeneralAbout | null = null;
  workingItems: GeneralWorking[] = [];
  teamMembers: GeneralTeam[] = [];
  services: GeneralService[] = [];

  private scriptsInitialized = false;

  constructor(
    private generalService: GeneralHomeService,
    private clientService: GeneralClientService,
    private aboutService: GeneralAboutService,
    private workingService: GeneralWorkingService,
    private teamService: GeneralTeamService,
    private generalServicesApi: GeneralServicesService
  ) { }

  /* =====================================================
     INIT
  ===================================================== */

  ngOnInit(): void {

    const savedLang = localStorage.getItem('lang');

    if (savedLang === 'ar' || savedLang === 'en') {
      this.currentLang = savedLang;
    } else {
      this.currentLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    }

    this.loadHero();
    this.loadClients();
    this.loadAbout();
    this.loadWorking();
    this.loadTeam();
    this.loadServices();
  }

  ngAfterViewInit(): void {
    this.reInitScripts();
  }

  /* =====================================================
     REINIT SCRIPTS (RUN ONLY ONCE)
  ===================================================== */

  private reInitScripts(): void {

    if (this.scriptsInitialized) return;

    setTimeout(() => {

      if (typeof manJs === 'function') {
        manJs();
      }

      if (this.currentLang === 'ar') {
        document.querySelectorAll('.swiper').forEach((el: any) => {
          el.dir = 'rtl';
        });
      }

      this.scriptsInitialized = true;

    }, 500);

  }

  /* =====================================================
     SERVICES (last loader triggers scripts)
  ===================================================== */

  loadServices() {
    this.generalServicesApi.getListPage().subscribe({
      next: (res) => {
        this.services = (res?.services || [])
          .filter(s => s.is_active === 1)
          .sort((a, b) => a.sort_order - b.sort_order);

        this.reInitScripts();
      },
      error: (err) => console.error('Services load error:', err)
    });
  }

  /* =====================================================
     HERO
  ===================================================== */

  loadHero() {
    this.generalService.getPublicHero().subscribe(res => {
      this.heroes = res;
    });
  }

  /* =====================================================
     CLIENTS
  ===================================================== */

  loadClients() {
    this.clientService.getPublicClients().subscribe(res => {
      this.clients = [...res, ...res, ...res];
    });
  }

  /* =====================================================
     ABOUT
  ===================================================== */

  loadAbout() {
    this.aboutService.getPublicAbout().subscribe(res => {
      this.about = res;
    });
  }

  /* =====================================================
     WORKING
  ===================================================== */

  loadWorking() {
    this.workingService.getPublicWorking().subscribe(res => {
      this.workingItems = res;
    });
  }

  /* =====================================================
     TEAM
  ===================================================== */

  loadTeam() {
    this.teamService.getPublicTeam().subscribe(res => {
      this.teamMembers = [...res, ...res, ...res];
    });
  }

  /* =====================================================
     HELPERS
  ===================================================== */

  getImage(path: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  }

  setLanguage(lang: 'en' | 'ar') {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);

    this.scriptsInitialized = false;
    this.reInitScripts();
  }

  getBrochure(): string | null {

    if (!this.about) return null;

    const file =
      this.currentLang === 'ar'
        ? this.about.brochure_ar
        : this.about.brochure_en;

    return file ? this.getImage(file) : null;
  }

  getTitle(): string {

    if (!this.about) return '';

    return this.currentLang === 'ar'
      ? this.about.title_ar || this.about.title_en
      : this.about.title_en || this.about.title_ar;
  }

  getDesc1(): string {

    if (!this.about) return '';

    return this.currentLang === 'ar'
      ? this.about.description_1_ar || this.about.description_1_en
      : this.about.description_1_en || this.about.description_1_ar;
  }

  getDesc2(): string {

    if (!this.about) return '';

    return this.currentLang === 'ar'
      ? this.about.description_2_ar || this.about.description_2_en
      : this.about.description_2_en || this.about.description_2_ar;
  }

}