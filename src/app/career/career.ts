import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CareerService, CareerJob } from '../service/career.service';
import { HeaderGeneral } from "../shared-headers/header-general/header-general";
import { GeneralFooter } from "../shared-footer/general-footer/general-footer";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

declare function manJs(): void;
declare var bootstrap: any;

@Component({
  selector: 'app-career',
  standalone: true,
  templateUrl: './career.html',
  styleUrl: './career.css',
  imports: [HeaderGeneral, GeneralFooter, FormsModule, RouterModule, CommonModule],
})
export class Career implements OnInit, AfterViewInit, OnDestroy {

  jobs: CareerJob[] = [];
  selectedJob: CareerJob | null = null;
  private modalInstance: any;

  /* ================= LANGUAGE ================= */
  isArabic = false;
  private storageListener?: () => void;

  /* ================= FORM ================= */
  form: any = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  errors: any = {};
  selectedFile: File | null = null;
  selectedFileName: string = '';
  isSubmitting = false;

  constructor(private careerService: CareerService) { }

  ngOnInit(): void {
    this.loadJobs();
    this.detectLanguage();
  }

  ngAfterViewInit() {
    setTimeout(() => manJs(), 0);
  }

  ngOnDestroy(): void {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener as any);
    }
  }

  /* ================= LANGUAGE ================= */
  detectLanguage() {
    const lang = localStorage.getItem('lang');
    this.isArabic = lang === 'ar';

    this.storageListener = () => {
      const l = localStorage.getItem('lang');
      this.isArabic = l === 'ar';
    };

    window.addEventListener('storage', this.storageListener as any);
  }

  t(en: string, ar: string) {
    return this.isArabic ? ar : en;
  }

  /* ================= TOAST ================= */
  showToast(message: string, isError = false) {
    const toastEl = document.getElementById('careerToast');
    const toastBody = document.getElementById('careerToastBody');

    if (!toastEl || !toastBody) return;

    toastBody.innerText = message;

    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(isError ? 'bg-danger' : 'bg-success');

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
  }

  /* ================= LOAD JOBS ================= */
  loadJobs() {
    this.careerService.getPublic().subscribe({
      next: (res) => this.jobs = res,
      error: () => this.showToast(this.t('Failed to load jobs', 'فشل تحميل الوظائف'), true)
    });
  }

  /* ================= FILE ================= */
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.showToast(this.t('Only PDF, DOC, DOCX allowed', 'يسمح فقط PDF و DOC و DOCX'), true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.showToast(this.t('Max file size is 5MB', 'الحد الأقصى 5MB'), true);
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  /* ================= MODAL ================= */
  openApplyModal(job: CareerJob | null = null): void {
    this.selectedJob = job;
    this.resetForm();

    setTimeout(() => {
      const modalEl = document.getElementById('applyJobModal');
      if (!modalEl) return;

      this.modalInstance?.dispose();
      this.modalInstance = new bootstrap.Modal(modalEl);
      this.modalInstance.show();
    }, 50);
  }

  /* ================= VALIDATION ================= */
  validateForm(): boolean {
    this.errors = {};

    if (!this.form.name) this.errors.name = this.t('Name required', 'الاسم مطلوب');

    if (!this.form.email) {
      this.errors.email = this.t('Email required', 'البريد الإلكتروني مطلوب');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.errors.email = this.t('Invalid email', 'بريد إلكتروني غير صالح');
    }

    if (!this.form.phone) this.errors.phone = this.t('Phone required', 'رقم الهاتف مطلوب');
    if (!this.selectedFile) this.errors.cv = this.t('CV required', 'السيرة الذاتية مطلوبة');

    return Object.keys(this.errors).length === 0;
  }

  /* ================= SUBMIT ================= */
  submitApplication() {

    if (!this.validateForm()) {
      this.showToast(this.t('Please fix form errors', 'يرجى تصحيح الأخطاء'), true);
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('phone', this.form.phone);
    formData.append('message', this.form.message || '');

    // ✅ FIX: handle general + job
    formData.append(
      'job_title',
      this.selectedJob?.title_en || 'General Application'
    );

    formData.append('cv', this.selectedFile!);

    this.careerService.apply(formData).subscribe({
      next: () => {
        this.showToast(this.t(
          'Application sent successfully',
          'تم إرسال الطلب بنجاح'
        ));
        this.closeModal();
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);

        if (err?.error?.errors) {
          this.errors = err.error.errors;
          this.showToast(this.t('Validation error', 'خطأ في التحقق'), true);
        } else {
          this.showToast(
            err?.error?.message ||
            this.t('Failed to send application', 'فشل إرسال الطلب'),
            true
          );
        }

        this.isSubmitting = false;
      }
    });
  }

  /* ================= RESET ================= */
  resetForm() {
    this.form = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
    this.selectedFile = null;
    this.selectedFileName = '';
    this.errors = {};
  }

  /* ================= CLOSE ================= */
  closeModal() {
    this.modalInstance?.hide();

    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
  }
}