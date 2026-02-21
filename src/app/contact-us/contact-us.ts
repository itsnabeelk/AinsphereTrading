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
    location_en: '993 Renner Burg, West Rond, MT 94251-030',
    location_ar: '993 رينر بورغ، ويست روند، MT 94251-030',
    emails: ['support@bexon.com', 'info@bexon.com'],
    phones: ['+1 (009) 544-7818', '+1 (009) 880-1810'],
    livechatEmail: 'livechat@bexon.com',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d316440.5712687838!2d-74.01091796224334!3d40.67186885683901!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1745918398047!5m2!1sen!2sbd'
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