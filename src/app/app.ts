import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { PreLoader } from "./pre-loader/pre-loader";
import { AuthService } from './service/auth.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

declare function manJs(): void;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PreLoader, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  isDashboardRoute = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    manJs();
    this.authService.initializeUser();

    // 🔥 Detect dashboard route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        const url = event.url;

        // ❗ disable smooth for dashboard + career (modal pages)
        this.isDashboardRoute =
          url.includes('/dashboard') ||
          url.includes('/career');

      });
  }
}
