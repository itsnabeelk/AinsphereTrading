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

  constructor(private api: MepHomeService) { }

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
  }

  getImage(path: string | null): string {
    return this.api.getImage(path);
  }
}
