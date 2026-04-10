import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../service/contact.service';
import { HeaderGeneral } from "../shared-headers/header-general/header-general";
import { GeneralFooter } from "../shared-footer/general-footer/general-footer";
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare function manJs(): void;

type ContactField = 'name' | 'email' | 'phone' | 'subject' | 'message';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderGeneral, GeneralFooter, RouterLink],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css'
})
export class ContactUs implements OnInit, AfterViewInit, OnDestroy {

  isArabic = false;

  contactInfo = {
    location_en: 'Riyadh, Kingdom of Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
    emails: ['info@ainsphere.com'],
    phones: ['+966543612700'],
    livechatEmail: 'info@ainsphere.com',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625.7672347667535!2d46.747780399999996!3d24.6661391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f0716c4690827%3A0xa167ec492f8c241a!2sAINSPHERE%20Ventures!5e0!3m2!1sen!2ssa!4v1774895314664!5m2!1sen!2ssa'
  };


  mapUrl!: SafeResourceUrl;

  form = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  sending = false;
  sent = false;
  errorMsg = '';

  submitted = false;
  fieldErrors: Record<ContactField, string> = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  /** Allows Latin & Arabic letters, spaces, hyphens, apostrophes, periods */
  readonly namePattern = "^[A-Za-z\\u0600-\\u06FF\\s'\\-.]+$";
  /** Phone: digits, +, -, spaces, parentheses */
  readonly phonePattern = '^[0-9+\\-\\s().]{7,20}$';

  private storageListener?: () => void;

  constructor(
    private contactApi: ContactService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.detectLanguage();
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.contactInfo.mapEmbedUrl);
  }

  ngAfterViewInit(): void {
    try { manJs(); } catch { }
  }

  ngOnDestroy(): void {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener as any);
      this.storageListener = undefined;
    }
  }

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

  private normalizeForm() {
    this.form = {
      name: (this.form.name || '').trim(),
      email: (this.form.email || '').trim(),
      phone: (this.form.phone || '').trim(),
      subject: (this.form.subject || '').trim(),
      message: (this.form.message || '').trim()
    };
  }

  private resetErrors() {
    this.errorMsg = '';
    this.fieldErrors = { name: '', email: '', phone: '', subject: '', message: '' };
  }

  // ✅ Clear backend error for a field (called from HTML on input/change)
  clearFieldError(field: ContactField) {
    this.fieldErrors[field] = '';
  }

  /** Allow only digits, +, -, (, ), space in phone fields */
  onPhoneKeyPress(event: KeyboardEvent): boolean {
    return /[0-9+\-\s().]/.test(event.key);
  }

  submit(f: NgForm) {
    if (this.sending) return;

    this.submitted = true;
    this.sent = false;
    this.resetErrors();

    // Front validation only for UI (backend is still the real protection)
    if (f.invalid) {
      Object.values(f.controls).forEach(c => c.markAsTouched());
      return;
    }

    this.normalizeForm();
    this.sending = true;

    this.contactApi.sendContact(this.form).subscribe({
      next: () => {
        this.sending = false;
        this.sent = true;
        this.submitted = false;

        this.form = { name: '', email: '', phone: '', subject: '', message: '' };
        f.resetForm(this.form);

        setTimeout(() => { this.sent = false; }, 4000);
      },

      error: (err) => {
        this.sending = false;

        // ✅ If backend returns { message:'Validation error', errors:{...} }
        const beErrors = err?.error?.errors;
        if (beErrors && typeof beErrors === 'object') {
          if (beErrors.name) this.fieldErrors.name = beErrors.name;
          if (beErrors.email) this.fieldErrors.email = beErrors.email;
          if (beErrors.phone) this.fieldErrors.phone = beErrors.phone;
          if (beErrors.subject) this.fieldErrors.subject = beErrors.subject;
          if (beErrors.message) this.fieldErrors.message = beErrors.message;

          // optional generic message on top
          this.errorMsg = this.t(
            'Please correct the highlighted fields.',
            'يرجى تصحيح الحقول المشار إليها.'
          );
          return;
        }

        // fallback (old backend messages)
        const msg =
          err?.error?.message ||
          this.t('Failed to send message.', 'فشل إرسال الرسالة.');

        this.errorMsg = msg;
      }
    });
  }
}