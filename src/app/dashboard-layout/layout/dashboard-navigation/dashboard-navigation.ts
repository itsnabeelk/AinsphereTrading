import {
  Component,
  AfterViewInit,
  Renderer2,
  ElementRef,
  OnDestroy,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { API_BASE_URL } from '../../../core/api.config';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard-navigation',
  templateUrl: './dashboard-navigation.html',
  styleUrl: './dashboard-navigation.css',
  imports: [RouterLink, CommonModule]
})
export class DashboardNavigation implements AfterViewInit, OnDestroy, OnInit {

  private resizeListener: any;
  private scrollListener: any;
  private userSub!: Subscription;

  userName = '';
  userAvatar = '/dashboad-assets/images/users/default.jpg';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private authService: AuthService,
  ) { }
  isReady = false;
  // ================= INIT =================
  ngOnInit(): void {
    this.userSub = this.authService.user$.subscribe(user => {

      if (user === undefined) return;

      this.isReady = true;

      if (user) {
        this.userName = user.name || '';
        this.userAvatar = user.avatar
          ? `${API_BASE_URL}${user.avatar}`
          : '/dashboad-assets/images/users/default.jpg';
      } else {
        this.userName = '';
        this.userAvatar = '/dashboad-assets/images/users/default.jpg';
      }
    });


  }


  // ================= AFTER VIEW =================
  ngAfterViewInit(): void {
    this.initSidebarToggle();
    this.initScrollBehavior();
    this.initVerticalMenu();
  }

  // ================= LOGOUT =================
  logout(): void {
    this.authService.logout();
  }

  // ================= DESTROY =================
  ngOnDestroy(): void {
    if (this.resizeListener) this.resizeListener();
    if (this.scrollListener) this.scrollListener();
    if (this.userSub) this.userSub.unsubscribe();
  }

  // ================= SIDEBAR =================
  private initSidebarToggle(): void {

    const toggleBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.startbar-overlay');

    const changeSidebarSize = () => {
      if (window.innerWidth >= 310 && window.innerWidth <= 1440) {
        document.body.setAttribute('data-sidebar-size', 'collapsed');
      } else {
        document.body.setAttribute('data-sidebar-size', 'default');
      }
    };

    toggleBtn?.addEventListener('click', () => {
      const current = document.body.getAttribute('data-sidebar-size');

      document.body.setAttribute(
        'data-sidebar-size',
        current === 'collapsed' ? 'default' : 'collapsed'
      );
    });

    overlay?.addEventListener('click', () => {
      document.body.setAttribute('data-sidebar-size', 'collapsed');
    });

    this.resizeListener = this.renderer.listen(
      'window',
      'resize',
      () => changeSidebarSize()
    );

    changeSidebarSize();
  }

  // ================= STICKY HEADER =================
  private initScrollBehavior(): void {
    this.scrollListener = this.renderer.listen(
      'window',
      'scroll',
      () => {
        const header = document.getElementById('topbar-custom');
        if (!header) return;

        if (
          document.body.scrollTop >= 50 ||
          document.documentElement.scrollTop >= 50
        ) {
          header.classList.add('nav-sticky');
        } else {
          header.classList.remove('nav-sticky');
        }
      }
    );
  }

  // ================= VERTICAL MENU =================
  private initVerticalMenu(): void {

    const collapseElements = document.querySelectorAll(
      '.navbar-nav li .collapse'
    );

    collapseElements.forEach((el) => {
      el.addEventListener('show.bs.collapse', (event: any) => {

        const opened = document.querySelectorAll(
          '.navbar-nav .collapse.show'
        );

        opened.forEach((other: any) => {
          if (other !== event.target) {
            other.classList.remove('show');
          }
        });

      });
    });
  }
}
