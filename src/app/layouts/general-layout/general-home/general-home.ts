import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralHomeService, GeneralHero } from '../../../service/general-home.service';
import { API_BASE_URL } from '../../../core/api.config';

declare function manJs(): void;

@Component({
  selector: 'app-general-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general-home.html',
  styleUrl: './general-home.css',
})
export class GeneralHome implements OnInit, AfterViewInit {

  heroes: GeneralHero[] = [];

  constructor(private generalService: GeneralHomeService) { }

  ngOnInit(): void {
    this.loadHero();
  }

  ngAfterViewInit(): void {
    // Important: run after DOM is ready
    setTimeout(() => {
      manJs();
    }, 200);
  }

  loadHero() {
    this.generalService.getPublicHero().subscribe({
      next: (res) => {
        this.heroes = res;

        // Re-run slider after data loads
        setTimeout(() => {
          manJs();
        }, 300);
      },
      error: (err) => {
        console.error('Hero load error:', err);
      }
    });
  }

  getImage(path: string) {
    return `${API_BASE_URL}${path}`;
  }

}
