import { Component, HostListener, OnInit } from '@angular/core';
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
  showWhatsAppBubble = false;
  currentLang: 'en' | 'ar' = 'en';
  whatsappTheme: 'general' | 'fmcg' | 'mep' | 'uniform' = 'general';
  readonly whatsappLink = 'https://wa.me/+966543612700';

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

        this.updateWhatsAppTheme(url);
        this.currentLang = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';
        this.showWhatsAppBubble = false;

      });

    this.currentLang = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';
    this.updateWhatsAppTheme(this.router.url || '');
  }

  toggleWhatsAppBubble(event?: Event): void {
    event?.stopPropagation();
    this.showWhatsAppBubble = !this.showWhatsAppBubble;
  }

  closeWhatsAppBubble(event?: Event): void {
    event?.stopPropagation();
    this.showWhatsAppBubble = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.whatsapp-widget')) {
      this.showWhatsAppBubble = false;
    }
  }

  private updateWhatsAppTheme(url: string): void {
    if (url.includes('/fmcg')) {
      this.whatsappTheme = 'fmcg';
      return;
    }

    if (url.includes('/mep')) {
      this.whatsappTheme = 'mep';
      return;
    }

    if (url.includes('/uniform')) {
      this.whatsappTheme = 'uniform';
      return;
    }

    this.whatsappTheme = 'general';
  }
}
