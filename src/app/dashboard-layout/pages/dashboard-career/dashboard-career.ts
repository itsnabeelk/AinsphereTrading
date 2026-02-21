import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CareerService, CareerJob } from '../../../service/career.service';

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard-career',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-career.html',
  styleUrl: './dashboard-career.css',
})
export class DashboardCareer implements OnInit {

  careers: CareerJob[] = [];
  loading = false;

  /* ================= FORM ================= */
  careerForm: any = {
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    job_type: '',
    location: '',
    salary: '',
    sort_order: 0
  };

  isEditing = false;
  editId: number | null = null;

  deleteId: number | null = null;

  constructor(private careerService: CareerService) { }

  ngOnInit(): void {
    this.loadCareers();
  }

  /* ================= LOAD ================= */
  loadCareers() {
    this.loading = true;

    this.careerService.getPublic().subscribe({
      next: (res) => {
        this.careers = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  /* ================= MODAL ================= */
  openModal() {
    this.resetForm();
    this.isEditing = false;

    const modal = new bootstrap.Modal(document.getElementById('careerModal'));
    modal.show();
  }

  editCareer(item: CareerJob) {
    this.isEditing = true;
    this.editId = item.id;

    this.careerForm = { ...item };

    const modal = new bootstrap.Modal(document.getElementById('careerModal'));
    modal.show();
  }

  /* ================= SAVE ================= */
  saveCareer() {
    if (!this.careerForm.title_en || !this.careerForm.title_ar) {
      this.showToast('Title EN & AR required', true);
      return;
    }

    if (this.isEditing && this.editId) {
      this.careerService.update(this.editId, this.careerForm).subscribe({
        next: () => {
          this.showToast('Updated successfully');
          this.loadCareers();
          this.closeModal();
        },
        error: () => this.showToast('Update failed', true)
      });
    } else {
      this.careerService.add(this.careerForm).subscribe({
        next: () => {
          this.showToast('Added successfully');
          this.loadCareers();
          this.closeModal();
        },
        error: () => this.showToast('Add failed', true)
      });
    }
  }

  /* ================= DELETE ================= */
  openDeleteModal(id: number) {
    this.deleteId = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.careerService.delete(this.deleteId).subscribe({
      next: () => {
        this.showToast('Deleted successfully');
        this.loadCareers();
      },
      error: () => this.showToast('Delete failed', true)
    });
  }

  /* ================= TOGGLE ================= */
  toggleStatus(id: number) {
    this.careerService.toggle(id).subscribe({
      next: () => {
        this.loadCareers();
      }
    });
  }

  /* ================= HELPERS ================= */
  resetForm() {
    this.careerForm = {
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      job_type: '',
      location: '',
      salary: '',
      sort_order: 0
    };
    this.editId = null;
  }

  closeModal() {
    const modalEl: any = document.getElementById('careerModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  /* ================= TOAST ================= */
  showToast(message: string, isError = false) {
    const toastEl = document.getElementById('careerToast');
    const toastBody = document.getElementById('careerToastBody');

    if (!toastEl || !toastBody) return;

    toastBody.innerText = message;
    toastEl.className = `toast ${isError ? 'bg-danger' : 'bg-success'} text-white`;

    new bootstrap.Toast(toastEl).show();
  }
}