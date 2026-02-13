import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { DashboardStyleService } from '../../layout/services/dashboard-style.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private styleService: DashboardStyleService
  ) { }

  ngOnInit(): void {

    this.styleService.load();

    // Use service, not localStorage directly
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password)
      .subscribe({
        next: (res: any) => {

          // Save token
          this.authService.saveToken(res.token);

          // Set user BEFORE navigation
          this.authService.setUser(res.user);

          // Important: small async queue to ensure state propagation
          setTimeout(() => {
            this.loading = false;
            this.router.navigate(['/dashboard']);
          }, 0);
        },

        error: (err) => {
          this.errorMessage =
            err?.error?.message || 'Invalid email or password';

          this.loading = false;
        }
      });
  }
}
