import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pre-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pre-loader.html',
  styleUrl: './pre-loader.css',
})
export class PreLoader {

  loading = true;

  constructor(private router: Router) {
    // Hard fallback so the preloader never blocks the app forever.
    setTimeout(() => {
      this.loading = false;
    }, 6000);

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.loading = true;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loading = false;
        }, 300); // smooth UX
      }

    });
  }
}


