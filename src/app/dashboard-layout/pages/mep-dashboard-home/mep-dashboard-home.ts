import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MepHomeService } from '../../../service/mep-home.service';
import { MepServicesService } from '../../../service/mep-services.service';
import { FooterSettingsService } from '../../../service/footer-settings.service';

declare var bootstrap: any;

@Component({
  selector: 'app-mep-dashboard-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mep-dashboard-home.html',
  styleUrl: './mep-dashboard-home.css',
})
export class MepDashboardHome implements OnInit {

  loading = true;
  footerData: any = { facebook_url: '', instagram_url: '', twitter_url: '', linkedin_url: '', email: '', phone: '', location_en: '', location_ar: '' };

  /* ================= TOAST ================= */

  showToast(message: string, type: 'success' | 'danger') {

    const toastEl = document.getElementById('mepToast');
    const toastBody = document.getElementById('mepToastBody');

    if (!toastEl || !toastBody) return;

    toastBody.innerText = message;

    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');

    new bootstrap.Toast(toastEl).show();
  }

  /* ================= HERO ================= */


  MAX_FILE_SIZE = 2 * 1024 * 1024;
  ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  heroSlides: any[] = [];

  heroForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    sort_order: 0,
    is_active: 1
  };

  heroPreview: string | null = null;
  selectedHeroFile: File | null = null;
  isHeroEditing = false;
  deleteType: 'hero' | null = null;
  deleteId: number | null = null;

  /* ================= ABOUT ================= */

  about: any = {};
  aboutPreview: string | null = null;
  selectedAboutFile: File | null = null;

  /* ================= WORKING ================= */

  working: any[] = [];

  workingForm: any = {
    id: null,
    step_number: 1,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: ''
  };

  isWorkingEditing = false;
  deleteWorkingId: number | null = null;

  /* ================= CLIENT ================= */

  clients: any[] = [];

  clientForm: any = {
    id: null,
    name: '',
    sort_order: 0,
    is_active: 1
  };

  clientPreview: string | null = null;
  selectedClientFile: File | null = null;
  isClientEditing = false;
  deleteClientId: number | null = null;


  services: any[] = [];

  serviceForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    slug: ''
  };

  selectedServiceFile: File | null = null;
  servicePreview: string | null = null;
  isServiceEditing = false;
  deleteServiceId: number | null = null;
  selectedBrochureEn: File | null = null;
  selectedBrochureAr: File | null = null;
  brochureEnPreview: string | null = null;
  brochureArPreview: string | null = null;

  constructor(
    private api: MepHomeService,
    private serviceApi: MepServicesService,
    private router: Router,
    private footerSettingsService: FooterSettingsService
  ) { }

  ngOnInit(): void {
    this.loadAll();
    this.loadFooterSettings();
  }

  loadFooterSettings() {
    this.footerSettingsService.getFooterSettings('mep').subscribe(res => {
      this.footerData = res;
    });
  }

  saveFooterSettings() {
    this.footerSettingsService.updateFooterSettings('mep', this.footerData).subscribe({
      next: () => this.showToast('Footer settings updated successfully', 'success'),
      error: err => this.showToast(err?.error?.message || 'Update failed', 'danger')
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/mep-dashboard']);
  }

  loadAll() {
    this.loadHero();
    this.loadAbout();
    this.loadWorking();
    this.loadClients();
    this.loadServices();

  }

  getImage(path: string | null) {
    return this.api.getImage(path);
  }

  /* ===================================================== */
  /* ================= HERO =============================== */
  /* ===================================================== */

  loadHero() {
    this.api.getHeroAdmin().subscribe({
      next: (res: any) => {
        this.heroSlides = res || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showToast('Failed to load hero slides', 'danger');
      }
    });
  }


  private validateImage(file: File, maxSize = this.MAX_FILE_SIZE): boolean {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.showToast('Only JPG, PNG or WEBP allowed', 'danger');
      return false;
    }

    if (file.size > maxSize) {
      this.showToast(`Image must be less than ${Math.round(maxSize / 1024 / 1024)}MB`, 'danger');
      return false;
    }

    return true;
  }

  saveHero() {
    const formData = new FormData();

    Object.keys(this.heroForm).forEach(key => {
      formData.append(key, this.heroForm[key] ?? '');
    });

    if (this.selectedHeroFile) {
      formData.append('image', this.selectedHeroFile);
    }

    this.api.saveHero(formData).subscribe({
      next: (res: any) => {
        this.showToast(res?.message || 'Hero slide saved successfully', 'success');
        this.loadHero();
        bootstrap.Modal.getInstance(document.getElementById('heroModal')!)?.hide();
        this.resetHeroForm();
      },
      error: (err: any) => {
        this.showToast(err?.error?.message || 'Failed to save hero slide', 'danger');
      }
    });
  }

  /* ===================================================== */
  /* ================= ABOUT ============================== */
  /* ===================================================== */

  loadAbout() {
    this.api.getAboutAdmin().subscribe(res => {
      this.about = res || {};
      this.aboutPreview = res?.image
        ? this.getImage(res.image)
        : null;
      this.brochureEnPreview = res?.brochure_en
        ? this.api.getFile(res.brochure_en)
        : null;

      this.brochureArPreview = res?.brochure_ar
        ? this.api.getFile(res.brochure_ar)
        : null;
    });
  }

  saveAbout() {

    const formData = new FormData();

    Object.keys(this.about).forEach(key => {
      formData.append(key, this.about[key] ?? '');
    });

    if (this.selectedAboutFile)
      formData.append('image', this.selectedAboutFile);

    if (this.selectedBrochureEn)
      formData.append('brochure_en', this.selectedBrochureEn);

    if (this.selectedBrochureAr)
      formData.append('brochure_ar', this.selectedBrochureAr);

    this.api.saveAbout(formData).subscribe({
      next: (res: any) => {
        this.showToast(res?.message || 'About saved successfully', 'success');
        this.loadAbout();
      },
      error: (err: any) => {

        this.showToast(err?.error?.message || 'Failed to save about', 'danger');
      }
    });
  }

  /* ===================================================== */
  /* ================= WORKING CRUD ======================= */
  /* ===================================================== */

  loadWorking() {
    this.api.getWorkingAdmin().subscribe(res => {
      this.working = res || [];
    });
  }

  openWorkingModal() {
    this.resetWorkingForm();
    new bootstrap.Modal(document.getElementById('workingModal')).show();
  }

  editWorking(item: any) {
    this.isWorkingEditing = true;
    this.workingForm = { ...item };
    new bootstrap.Modal(document.getElementById('workingModal')).show();
  }

  saveWorking() {

    const request = this.isWorkingEditing
      ? this.api.updateWorking(this.workingForm.id, this.workingForm)
      : this.api.createWorking(this.workingForm);

    request.subscribe({
      next: () => {
        this.showToast('Working step saved successfully', 'success');
        this.loadWorking();
        bootstrap.Modal.getInstance(document.getElementById('workingModal')!)?.hide();
        this.resetWorkingForm();
      },
      error: (err: any) => {

        this.showToast(err?.error?.message || 'Failed to save step', 'danger');
      }
    });
  }

  openWorkingDeleteModal(id: number) {
    this.deleteWorkingId = id;
    new bootstrap.Modal(document.getElementById('workingDeleteModal')).show();
  }

  confirmWorkingDelete() {

    if (!this.deleteWorkingId) return;

    this.api.deleteWorking(this.deleteWorkingId).subscribe(() => {
      this.showToast('Step deleted successfully', 'success');
      this.loadWorking();
      bootstrap.Modal.getInstance(document.getElementById('workingDeleteModal')!)?.hide();
    });
  }

  resetWorkingForm() {
    this.isWorkingEditing = false;
    this.workingForm = {
      id: null,
      step_number: 1,
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: ''
    };
  }

  /* ===================================================== */
  /* ================= CLIENT CRUD ======================== */
  /* ===================================================== */

  loadClients() {
    this.api.getClientsAdmin().subscribe(res => {
      this.clients = res || [];
    });
  }

  openClientModal() {
    this.resetClientForm();
    new bootstrap.Modal(document.getElementById('clientModal')).show();
  }

  editClient(client: any) {
    this.isClientEditing = true;
    this.clientForm = { ...client };
    this.clientPreview = client.image ? this.getImage(client.image) : null;
    new bootstrap.Modal(document.getElementById('clientModal')).show();
  }

  saveClient() {

    const formData = new FormData();

    Object.keys(this.clientForm).forEach(key => {
      formData.append(key, this.clientForm[key] ?? '');
    });

    if (this.selectedClientFile)
      formData.append('image', this.selectedClientFile);

    const request = this.isClientEditing
      ? this.api.updateClient(this.clientForm.id, formData)
      : this.api.createClient(formData);

    request.subscribe({
      next: () => {
        this.showToast('Client saved successfully', 'success');
        this.loadClients();
        bootstrap.Modal.getInstance(document.getElementById('clientModal')!)?.hide();
        this.resetClientForm();
      },
      error: (err: any) => {

        this.showToast(err?.error?.message || 'Upload failed', 'danger');
      }
    });
  }

  openClientDeleteModal(id: number) {
    this.deleteClientId = id;
    new bootstrap.Modal(document.getElementById('clientDeleteModal')).show();
  }

  confirmClientDelete() {

    if (!this.deleteClientId) return;

    this.api.deleteClient(this.deleteClientId).subscribe(() => {
      this.showToast('Client deleted successfully', 'success');
      this.loadClients();
      bootstrap.Modal.getInstance(document.getElementById('clientDeleteModal')!)?.hide();
    });
  }

  resetClientForm() {
    this.isClientEditing = false;
    this.clientForm = {
      id: null,
      name: '',
      sort_order: 0,
      is_active: 1
    };
    this.selectedClientFile = null;
    this.clientPreview = null;
  }


  onHeroImageChange(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!this.validateImage(file)) {
      event.target.value = '';
      return;
    }

    this.selectedHeroFile = file;

    const reader = new FileReader();
    reader.onload = () => this.heroPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  onAboutFileChange(event: any) {

    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.showToast('Only JPG, PNG or WEBP allowed', 'danger');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.showToast('Image must be less than 2MB', 'danger');
      event.target.value = '';
      return;
    }

    this.selectedAboutFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.aboutPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  onClientFileChange(event: any) {

    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
      this.showToast('Only JPG, PNG or WEBP allowed', 'danger');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.showToast('Image must be less than 1MB', 'danger');
      event.target.value = '';
      return;
    }

    this.selectedClientFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.clientPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  /* ===================================================== */
  /* ================= SERVICE CRUD ======================= */
  /* ===================================================== */


  loadServices() {
    this.serviceApi.getAdmin()
      .subscribe(res => {
        this.services = res || [];
      });
  }

  openServiceModal() {
    this.resetServiceForm();
    new bootstrap.Modal(document.getElementById('serviceModal')).show();
  }

  editService(service: any) {
    this.isServiceEditing = true;
    this.serviceForm = { ...service };
    this.servicePreview = service.image ? this.getImage(service.image) : null;
    new bootstrap.Modal(document.getElementById('serviceModal')).show();
  }

  saveService() {

    const formData = new FormData();

    Object.keys(this.serviceForm).forEach(key => {
      formData.append(key, this.serviceForm[key] ?? '');
    });

    if (this.selectedServiceFile)
      formData.append('image', this.selectedServiceFile);

    const request = this.isServiceEditing
      ? this.serviceApi.update(this.serviceForm.id, formData)
      : this.serviceApi.create(formData);


    request.subscribe({
      next: () => {
        this.showToast('Service saved successfully', 'success');
        this.loadServices();
        bootstrap.Modal.getInstance(document.getElementById('serviceModal')!)?.hide();
        this.resetServiceForm();
      },
      error: (err: any) => {

        this.showToast(err?.error?.message || 'Failed to save service', 'danger');
      }
    });
  }

  openServiceDeleteModal(id: number) {
    this.deleteServiceId = id;
    new bootstrap.Modal(document.getElementById('serviceDeleteModal')).show();
  }

  confirmServiceDelete() {
    if (!this.deleteServiceId) return;

    this.serviceApi.delete(this.deleteServiceId).subscribe(() => {

      this.showToast('Service deleted successfully', 'success');
      this.loadServices();
      bootstrap.Modal.getInstance(document.getElementById('serviceDeleteModal')!)?.hide();
    });
  }

  resetServiceForm() {
    this.isServiceEditing = false;
    this.serviceForm = {
      id: null,
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: ''
    };
    this.selectedServiceFile = null;
    this.servicePreview = null;
  }


  onServiceFileChange(event: any) {

    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.showToast('Only JPG, PNG or WEBP allowed', 'danger');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.showToast('Image must be less than 2MB', 'danger');
      event.target.value = '';
      return;
    }

    this.selectedServiceFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.servicePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  goToServiceDetail(service: any) {
    this.router.navigate([
      '/dashboard/mep-service-detail',
      service.id
    ]);
  }

  toggleServiceStatus(service: any) {

    const newStatus = service.is_active ? 0 : 1;

    this.serviceApi.toggleStatus(service.id, newStatus)
      .subscribe({
        next: () => {
          service.is_active = newStatus;
          this.showToast('Status updated successfully', 'success');
        },
        error: (err: any) => {
          this.showToast(err?.error?.message || 'Failed to update status', 'danger');
        }
      });
  }
  onBrochureEnChange(event: any) {

    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 15 * 1024 * 1024;

    if (file.type !== 'application/pdf') {
      this.showToast('Only PDF allowed (English)', 'danger');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.showToast('English brochure must be less than 15MB', 'danger');
      event.target.value = '';
      return;
    }

    this.selectedBrochureEn = file;
    this.brochureEnPreview = URL.createObjectURL(file);
  }


  onBrochureArChange(event: any) {

    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 15 * 1024 * 1024;

    if (file.type !== 'application/pdf') {
      this.showToast('Only PDF allowed (Arabic)', 'danger');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.showToast('Arabic brochure must be less than 15MB', 'danger');
      event.target.value = '';
      return;
    }

    this.selectedBrochureAr = file;
    this.brochureArPreview = URL.createObjectURL(file);
  }

  getFile(path: string | null) {
    return this.api.getFile(path);
  }


  openHeroModal() {
    this.resetHeroForm();
    new bootstrap.Modal(document.getElementById('heroModal')).show();
  }

  editHero(slide: any) {
    this.isHeroEditing = true;
    this.heroForm = { ...slide };
    this.heroPreview = slide?.image ? this.getImage(slide.image) : null;
    this.selectedHeroFile = null;
    new bootstrap.Modal(document.getElementById('heroModal')).show();
  }

  resetHeroForm() {
    this.isHeroEditing = false;
    this.heroForm = {
      id: null,
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      sort_order: 0,
      is_active: 1
    };
    this.heroPreview = null;
    this.selectedHeroFile = null;
  }

  openDeleteModal(type: 'hero', id: number) {
    this.deleteType = type;
    this.deleteId = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  }

  confirmDelete() {
    if (!this.deleteType || !this.deleteId) return;

    if (this.deleteType === 'hero') {
      this.api.deleteHero(this.deleteId).subscribe({
        next: () => {
          this.showToast('Hero slide deleted successfully', 'success');
          this.loadHero();
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')!)?.hide();
        },
        error: (err: any) => {
          this.showToast(err?.error?.message || 'Delete failed', 'danger');
        }
      });
    }
  }


  toggleHeroStatus(slide: any) {

    const newStatus = slide.is_active ? 0 : 1;

    this.api.toggleHeroStatus(slide.id, newStatus)
      .subscribe({
        next: () => {
          slide.is_active = newStatus;
          this.showToast('Hero status updated', 'success');
        },
        error: (err: any) => {
          this.showToast(err?.error?.message || 'Failed to update status', 'danger');
        }
      });
  }

}
