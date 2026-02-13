import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { API_BASE_URL } from '../../../core/api.config';

declare var bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  name = '';
  email = '';

  avatarPreview: string | null = null;
  selectedFile: File | null = null;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  loadingProfile = false;
  loadingPassword = false;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  // ================= LOAD PROFILE =================
  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.name = res.user.name;
        this.email = res.user.email;

        this.avatarPreview = res.user.avatar
          ? `${API_BASE_URL}${res.user.avatar}`
          : 'assets/dashboard/images/users/default.jpg';
      },
      error: (err) => {
        this.showToast(this.normalizeError(err), true);
      }
    });
  }

  // ================= AVATAR PREVIEW =================
  onFileChange(event: any) {

    const file = event.target.files[0];
    if (!file) return;

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.showToast('Image must be less than 2MB', true);
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.showToast('Only JPG and PNG allowed', true);
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ================= UPDATE PROFILE =================
  updateProfile() {

    if (!this.name || !this.email) {
      this.showToast('Name and Email are required', true);
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.loadingProfile = true;

    this.authService.updateProfile(formData).subscribe({
      next: () => {

        // Reload profile after update
        this.authService.getProfile().subscribe((res: any) => {

          this.authService.setUser(res.user);

          this.avatarPreview = res.user.avatar
            ? `${API_BASE_URL}${res.user.avatar}?t=${new Date().getTime()}`
            : 'assets/dashboard/images/users/default.jpg';

        });

        this.selectedFile = null;
        this.showToast('Profile updated successfully', false);
        this.loadingProfile = false;
      },
      error: (err) => {
        this.showToast(this.normalizeError(err), true);
        this.loadingProfile = false;
      }
    });
  }

  // ================= CHANGE PASSWORD =================
  changePassword() {

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.showToast('All password fields are required', true);
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showToast('Passwords do not match', true);
      return;
    }

    const strongRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;

    if (!strongRegex.test(this.newPassword)) {
      this.showToast(
        'Password must be 8+ chars, include uppercase, number, and special character.',
        true
      );
      return;
    }

    this.loadingPassword = true;

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {

        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        this.showToast('Password changed successfully', false);
        this.loadingPassword = false;
      },
      error: (err) => {
        this.showToast(this.normalizeError(err), true);
        this.loadingPassword = false;
      }
    });
  }

  // ================= TOAST =================
  showToast(message: string, isError: boolean) {

    const toastEl = document.getElementById('profileToast');
    const toastBody = document.getElementById('profileToastBody');

    if (!toastEl || !toastBody) return;

    toastBody.innerText = message;

    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(isError ? 'bg-danger' : 'bg-success');

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
  }

  // ================= NORMALIZE BACKEND ERROR =================
  normalizeError(err: any): string {

    if (err?.error?.message) {
      return err.error.message;
    }

    if (err.status === 0) {
      return 'Server unreachable. Please try again.';
    }

    return 'Something went wrong. Please try again.';
  }
}
