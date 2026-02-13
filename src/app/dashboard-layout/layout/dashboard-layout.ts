import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DashboardStyleService } from './services/dashboard-style.service';
import { DashboardNavigation } from './dashboard-navigation/dashboard-navigation';

@Component({
  standalone: true,
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterOutlet, DashboardNavigation],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout implements OnInit, OnDestroy {

  constructor(private styleService: DashboardStyleService) { }

  ngOnInit(): void {
    this.styleService.load();
    document.body.setAttribute('data-startbar', 'dark');
    document.body.setAttribute('data-bs-theme', 'light');
  }

  ngOnDestroy(): void {
    this.styleService.remove();

    document.body.removeAttribute('data-startbar');
    document.body.removeAttribute('data-bs-theme');
  }

}
