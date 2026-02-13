import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralHomeService, GeneralHero } from '../../../service/general-home.service';
import { API_BASE_URL } from '../../../core/api.config';

declare var bootstrap: any;

@Component({
  selector: 'app-general-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-home.html',
  styleUrl: './general-home.css'
})
export class GeneralHome implements OnInit {

  heroes: GeneralHero[] = [];

  form: any = {
    id: null,
    title_en: '',
    title_ar: ''
  };
  previewImage: string | null = null;
  deleteId: number | null = null;

  selectedFile: File | null = null;
  isEditing = false;

  constructor(private service: GeneralHomeService) { }


  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes() {
    this.service.getAdminHero().subscribe((res: any) => {
      this.heroes = res;
    });
  }

  getImage(path: string) {
    return `${API_BASE_URL}${path}`;
  }

  openHeroModal() {
    this.resetForm();
    new bootstrap.Modal(document.getElementById('heroModal')).show();
  }

  editHero(hero: any) {
    this.isEditing = true;
    this.form = { ...hero };
    this.previewImage = this.getImage(hero.image);
    this.selectedFile = null;

    new bootstrap.Modal(document.getElementById('heroModal')).show();
  }

  onFileChange(event: any) {

    const file = event.target.files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Image must be less than 5MB', true);
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.showToast('Only image files allowed', true);
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }



  saveHero() {

    const formData = new FormData();
    formData.append('title_en', this.form.title_en || '');
    formData.append('title_ar', this.form.title_ar || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request$ = this.isEditing
      ? this.service.updateHero(this.form.id, formData)
      : this.service.createHero(formData);

    request$.subscribe({
      next: () => {
        this.afterSave();
      },
      error: (err) => {
        this.showToast(
          err?.error?.message || 'Something went wrong',
          true
        );
      }
    });
  }


  deleteHero(id: number) {
    if (!confirm('Delete this slide?')) return;

    this.service.deleteHero(id).subscribe({
      next: () => {
        this.showToast('Deleted successfully', false);
        this.loadHeroes();
      },
      error: (err) => {
        this.showToast(
          err?.error?.message || 'Delete failed',
          true
        );
      }
    });
  }


  toggleHero(id: number) {
    this.service.toggleHero(id).subscribe({
      next: () => {
        this.loadHeroes();
      },
      error: (err) => {
        this.showToast(
          err?.error?.message || 'Status update failed',
          true
        );
      }
    });
  }


  afterSave() {
    this.showToast('Saved successfully', false);
    this.loadHeroes();
    bootstrap.Modal.getInstance(document.getElementById('heroModal')).hide();
  }

  resetForm() {
    this.isEditing = false;
    this.form = { id: null, title_en: '', title_ar: '' };
    this.selectedFile = null;
    this.previewImage = null;
  }


  showToast(message: string, isError: boolean) {
    const toastEl = document.getElementById('generalToast');
    const toastBody = document.getElementById('generalToastBody');

    toastBody!.innerText = message;

    toastEl!.classList.remove('bg-success', 'bg-danger');
    toastEl!.classList.add(isError ? 'bg-danger' : 'bg-success');

    new bootstrap.Toast(toastEl!, { delay: 3000 }).show();
  }

  openDeleteModal(id: number) {
    this.deleteId = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.service.deleteHero(this.deleteId).subscribe({
      next: () => {
        this.showToast('Deleted successfully', false);
        this.loadHeroes();
        bootstrap.Modal.getInstance(document.getElementById('deleteModal'))?.hide();
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Delete failed', true);
      }
    });
  }


}
