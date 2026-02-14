import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

import { GeneralHomeService, GeneralHero } from '../../../service/general-home.service';
import { GeneralClientService, GeneralClient } from '../../../service/general-client.service';
import { GeneralAboutService, GeneralAbout } from '../../../service/general-about.service';
import { GeneralWorkingService, GeneralWorking } from '../../../service/general-working.service';
import { GeneralTeamService, GeneralTeam } from '../../../service/general-team.service';

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

  constructor(
    private generalService: GeneralHomeService,
    private clientService: GeneralClientService,
    private aboutService: GeneralAboutService,
    private workingService: GeneralWorkingService,
    private teamService: GeneralTeamService
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
  }

  ngAfterViewInit(): void {
    this.reInitScripts();
  }

  /* =====================================================
     REINIT SCRIPTS (SAFE SWIPER RESET)
  ===================================================== */

  private reInitScripts(): void {
    setTimeout(() => {
      if (typeof manJs === 'function') {
        manJs();
      }

      if (this.currentLang === 'ar') {
        document.querySelectorAll('.swiper').forEach((el: any) => {
          el.dir = 'rtl';
        });
      }
    }, 300);
  }

  /* =====================================================
     HERO
  ===================================================== */

  loadHero() {
    this.generalService.getPublicHero().subscribe(res => {
      this.heroes = res;
      this.reInitScripts();
    });
  }

  /* =====================================================
     CLIENTS (DUPLICATED FOR SMOOTH LOOP)
  ===================================================== */

  loadClients() {
    this.clientService.getPublicClients().subscribe(res => {
      // Duplicate for smooth infinite marquee
      this.clients = [...res, ...res, ...res];
      this.reInitScripts();
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
      this.reInitScripts();
    });
  }

  /* =====================================================
     TEAM (DUPLICATED FOR SMOOTH LOOP)
  ===================================================== */

  loadTeam() {
    this.teamService.getPublicTeam().subscribe(res => {
      // Duplicate for smooth infinite marquee
      this.teamMembers = [...res, ...res, ...res];
      this.reInitScripts();
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
