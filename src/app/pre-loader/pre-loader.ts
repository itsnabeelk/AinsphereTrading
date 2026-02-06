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

  loading = false;

  constructor(private router: Router) {
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


