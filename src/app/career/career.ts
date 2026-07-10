import { Component, AfterViewInit, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  formattedJobDescription = '';
  private viewModalInstance: any;

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
  showWhatsAppBubble = false;
  readonly whatsappLink = 'https://wa.me/+966543612700';

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
    
    // Clean up modals from body to prevent memory / DOM leaks
    const applyModalEl = document.getElementById('applyJobModal');
    if (applyModalEl && applyModalEl.parentNode === document.body) {
      document.body.removeChild(applyModalEl);
    }
    const viewModalEl = document.getElementById('viewJobModal');
    if (viewModalEl && viewModalEl.parentNode === document.body) {
      document.body.removeChild(viewModalEl);
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
    const file: File = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.errors.cv = this.t('Only PDF files are allowed', 'يسمح فقط بملفات PDF');
      this.selectedFile = null;
      this.selectedFileName = '';
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errors.cv = this.t('Max file size is 5MB', 'الحد الأقصى للحجم هو 5 ميجابايت');
      this.selectedFile = null;
      this.selectedFileName = '';
      event.target.value = '';
      return;
    }

    this.errors.cv = '';
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

      // Move modal to body to prevent GSAP ScrollSmoother transform issues
      document.body.appendChild(modalEl);

      this.modalInstance?.dispose();
      this.modalInstance = new bootstrap.Modal(modalEl);
      this.modalInstance.show();
    }, 50);
  }

  openReadMoreModal(job: CareerJob): void {
    this.selectedJob = job;
    this.formattedJobDescription = this.formatDescription(this.isArabic ? job.description_ar : job.description_en);

    setTimeout(() => {
      const modalEl = document.getElementById('viewJobModal');
      if (!modalEl) return;

      // Move modal to body to prevent GSAP ScrollSmoother transform issues
      document.body.appendChild(modalEl);

      this.viewModalInstance?.dispose();
      this.viewModalInstance = new bootstrap.Modal(modalEl);
      this.viewModalInstance.show();
    }, 50);
  }

  closeReadMoreModal() {
    this.viewModalInstance?.hide();

    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
  }

  applyFromReadMore() {
    const job = this.selectedJob;
    this.closeReadMoreModal();
    setTimeout(() => {
      this.openApplyModal(job);
    }, 300);
  }

  formatDescription(text: string): string {
    if (!text) return '';
    
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (let line of lines) {
      line = line.trim();
      if (!line) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        continue;
      }

      if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
        if (!inList) {
          html += '<ul class="job-desc-list">';
          inList = true;
        }
        const content = line.substring(1).trim();
        html += `<li>${content}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<p class="job-desc-para">${line}</p>`;
      }
    }

    if (inList) {
      html += '</ul>';
    }

    return html;
  }

  getPreviewDescription(text: string): string {
    if (!text) return '';
    let cleanText = text.replace(/[-*•]/g, '').replace(/\n+/g, ' ').trim();
    if (cleanText.length > 120) {
      return cleanText.substring(0, 120) + '...';
    }
    return cleanText;
  }

  /* ================= VALIDATION ================= */
  validateForm(): boolean {
    this.errors = {};
    const namePattern = /^[\p{L}\s'\-.]+$/u;
    const phonePattern = /^[0-9+\-\s().]{7,20}$/;

    // Name
    if (!this.form.name || !this.form.name.trim()) {
      this.errors.name = this.t('Full name is required', 'الاسم الكامل مطلوب');
    } else if (this.form.name.trim().length < 2) {
      this.errors.name = this.t('Name must be at least 2 characters', 'يجب أن يكون الاسم حرفين على الأقل');
    } else if (!namePattern.test(this.form.name.trim())) {
      this.errors.name = this.t('Name must contain letters only', 'يجب أن يحتوي الاسم على حروف فقط');
    }

    // Email
    if (!this.form.email || !this.form.email.trim()) {
      this.errors.email = this.t('Email is required', 'البريد الإلكتروني مطلوب');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.form.email.trim())) {
      this.errors.email = this.t('Please enter a valid email address', 'يرجى إدخال بريد إلكتروني صحيح');
    }

    // Phone
    if (!this.form.phone || !this.form.phone.trim()) {
      this.errors.phone = this.t('Phone number is required', 'رقم الهاتف مطلوب');
    } else if (!phonePattern.test(this.form.phone.trim())) {
      this.errors.phone = this.t('Phone must be 7–20 digits (+ - spaces allowed)', 'يجب أن يكون رقم الهاتف 7-20 رقماً');
    }

    // CV
    if (!this.selectedFile) {
      this.errors.cv = this.t('CV file is required (PDF only)', 'السيرة الذاتية مطلوبة (PDF فقط)');
    }

    return Object.keys(this.errors).length === 0;
  }

  /** Allow only digits, +, -, (, ), space in phone fields */
  onPhoneKeyPress(event: KeyboardEvent): boolean {
    return /[0-9+\-\s().]/.test(event.key);
  }

  /** Clear a single field error when user starts typing */
  clearError(field: string) {
    if (this.errors[field]) {
      this.errors[field] = '';
    }
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

        if (err?.error?.errors && typeof err.error.errors === 'object') {
          // Map backend field errors directly onto the errors object
          this.errors = { ...err.error.errors };
          this.showToast(this.t('Please correct the highlighted fields', 'يرجى تصحيح الحقول المشار إليها'), true);
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
}