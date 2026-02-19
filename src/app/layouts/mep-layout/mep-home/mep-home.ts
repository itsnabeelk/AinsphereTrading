import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-mep-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './mep-home.html',
  styleUrl: './mep-home.css',
})
export class MepHome implements OnInit {

  currentLang: 'en' | 'ar' = 'en';

  hero: MepHero | null = null;
  about: MepAbout | null = null;
  working: MepWorking[] = [];
  clients: MepClient[] = [];
  services: any[] = [];

  constructor(
    private api: MepHomeService,
    private serviceApi: MepServicesService
  ) { }

  ngOnInit(): void {

    const lang = localStorage.getItem('lang');
    if (lang === 'ar' || lang === 'en') {
      this.currentLang = lang;
    }

    this.loadData();

    setTimeout(() => manJs(), 400);
  }

  loadData() {
    this.api.getHeroPublic().subscribe((res: any) => this.hero = res);
    this.api.getAboutPublic().subscribe((res: any) => this.about = res);
    this.api.getWorkingPublic().subscribe((res: any[]) => this.working = res);
    this.api.getClientsPublic().subscribe((res: any[]) => this.clients = res);

    // ✅ ADD THIS
    this.serviceApi.getPublic().subscribe((res: any[]) => {
      this.services = res?.filter(s => s.is_active == 1) || [];
    });
  }


  getImage(path: string | null): string {
    return this.api.getImage(path);
  }
}
