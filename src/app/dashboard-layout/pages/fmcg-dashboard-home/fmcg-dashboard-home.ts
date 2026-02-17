import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FmcgHomeService } from '../../../service/fmcg-home.service';
import { FmcgServicesService, FmcgService } from '../../../service/fmcg-services.service';


declare var bootstrap: any;

@Component({
  selector: 'app-fmcg-dashboard-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fmcg-dashboard-home.html',
  styleUrl: './fmcg-dashboard-home.css'
})
export class FmcgDashboardHome implements OnInit {

  loading = true;

  /* ================= HERO ================= */

  heroSlides: any[] = [];
  heroForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    button_text_en: '',
    button_text_ar: '',
    button_link: '',
    sort_order: 0,
    is_active: 1
  };

  heroPreview: string | null = null;
  selectedHeroFile: File | null = null;
  isHeroEditing = false;
  services: any[] = [];

  serviceForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    sort_order: 0,
    is_active: 1
  };

  selectedServiceFile: File | null = null;
  servicePreview: string | null = null;
  isServiceEditing = false;
  deleteServiceId: number | null = null;

  /* ================= ABOUT ================= */

  aboutForm: any = {
    title_en: '',
    title_ar: '',
    sub_title_en: '',
    sub_title_ar: '',
    description_en: '',
    description_ar: '',
    funfact_1_number: '',
    funfact_1_text_en: '',
    funfact_1_text_ar: '',
    funfact_1_suffix: '',
    funfact_2_number: '',
    funfact_2_text_en: '',
    funfact_2_text_ar: '',
    funfact_2_suffix: ''
  };

  aboutPreview: string | null = null;
  selectedAboutFile: File | null = null;

  /* ================= MARQUEE ================= */

  marqueeItems: any[] = [];
  marqueeForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    sort_order: 0
  };

  isMarqueeEditing = false;

  /* ================= CLIENTS ================= */

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

  constructor(
    private router: Router,
    private api: FmcgHomeService,
    private servicesApi: FmcgServicesService
  ) { }

  ngOnInit(): void {
    this.loadAll();
    this.loadServices();
  }

  /* ================= LOAD ALL ================= */

  loadAll() {
    this.loadHero();
    this.loadAbout();
    this.loadMarquee();
    this.loadClients();
  }

  getImage(path: string | null) {
    return this.api.getImage(path);
  }

  goBack() {
    this.router.navigate(['/dashboard/fmcg-dashboard']);
  }

  /* ===================================================== */
  /* ================= HERO =============================== */
  /* ===================================================== */

  loadHero() {
    this.api.getHeroAdmin().subscribe(res => {
      this.heroSlides = res || [];
      this.loading = false;
    });
  }

  openHeroModal() {
    this.resetHero();
    new bootstrap.Modal(document.getElementById('heroModal')).show();
  }

  editHero(hero: any) {
    this.isHeroEditing = true;
    this.heroForm = { ...hero };
    this.heroPreview = hero.image ? this.getImage(hero.image) : null;
    new bootstrap.Modal(document.getElementById('heroModal')).show();
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

      next: () => {
        this.loadHero();
        bootstrap.Modal
          .getInstance(document.getElementById('heroModal')!)
          ?.hide();

        this.resetHero();
        this.showToast('Hero saved successfully', 'success');
      },

      error: (err) => {
        const message =
          err?.error?.message ||
          'Upload failed. File must be under 2MB and valid format.';

        this.showToast(message, 'danger');
      }

    });
  }


  showToast(message: string, type: 'success' | 'danger') {

    const toastEl = document.getElementById('fmcgToast');
    const toastBody = document.getElementById('fmcgToastBody');

    if (!toastEl || !toastBody) return;

    toastBody.innerText = message;

    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');

    new bootstrap.Toast(toastEl).show();
  }


  deleteHero(id: number) {
    if (!confirm('Delete this slide?')) return;
    this.api.deleteHero(id).subscribe(() => this.loadHero());
  }

  onHeroImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedHeroFile = file;
    const reader = new FileReader();
    reader.onload = () => this.heroPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  resetHero() {
    this.isHeroEditing = false;
    this.heroForm = {
      id: null,
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      button_text_en: '',
      button_text_ar: '',
      button_link: '',
      sort_order: 0,
      is_active: 1
    };
    this.heroPreview = null;
    this.selectedHeroFile = null;
  }

  /* ===================================================== */
  /* ================= ABOUT ============================== */
  /* ===================================================== */

  loadAbout() {
    this.api.getAboutAdmin().subscribe(res => {
      if (res) {
        this.aboutForm = { ...res };
        this.aboutPreview = res.image ? this.getImage(res.image) : null;
      }
    });
  }

  saveAbout() {
    const formData = new FormData();

    Object.keys(this.aboutForm).forEach(key => {
      formData.append(key, this.aboutForm[key] ?? '');
    });

    if (this.selectedAboutFile) {
      formData.append('image', this.selectedAboutFile);
    }

    this.api.saveAbout(formData).subscribe({

      next: () => {
        this.showToast('About updated successfully', 'success');
      },

      error: (err) => {
        const message =
          err?.error?.message ||
          'Upload failed. File must be under 2MB and valid format.';

        this.showToast(message, 'danger');
      }

    });

  }

  onAboutImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedAboutFile = file;
    const reader = new FileReader();
    reader.onload = () => this.aboutPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  /* ===================================================== */
  /* ================= MARQUEE ============================ */
  /* ===================================================== */

  loadMarquee() {
    this.api.getMarqueeAdmin().subscribe(res => {
      this.marqueeItems = res || [];
    });
  }

  saveMarquee() {
    const request = this.isMarqueeEditing
      ? this.api.updateMarquee(this.marqueeForm.id, this.marqueeForm)
      : this.api.createMarquee(this.marqueeForm);

    request.subscribe(() => {
      this.loadMarquee();
      this.resetMarquee();
    });
  }

  editMarquee(item: any) {
    this.isMarqueeEditing = true;
    this.marqueeForm = { ...item };
  }

  deleteMarquee(id: number) {
    this.api.deleteMarquee(id).subscribe(() => this.loadMarquee());
  }

  resetMarquee() {
    this.isMarqueeEditing = false;
    this.marqueeForm = {
      id: null,
      title_en: '',
      title_ar: '',
      sort_order: 0
    };
  }

  /* ===================================================== */
  /* ================= CLIENTS ============================ */
  /* ===================================================== */

  loadClients() {
    this.api.getClientsAdmin().subscribe(res => {
      this.clients = res || [];
    });
  }

  openClientModal() {
    this.resetClient();
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

    if (this.selectedClientFile) {
      formData.append('image', this.selectedClientFile);
    }

    const request = this.isClientEditing
      ? this.api.updateClient(this.clientForm.id, formData)
      : this.api.createClient(formData);

    request.subscribe({

      next: () => {
        this.loadClients();
        bootstrap.Modal
          .getInstance(document.getElementById('clientModal')!)
          ?.hide();

        this.resetClient();
        this.showToast('Client saved successfully', 'success');
      },

      error: (err) => {
        const message =
          err?.error?.message ||
          'Upload failed. File must be under 1MB and JPG/PNG/WEBP only.';

        this.showToast(message, 'danger');
      }

    });
  }


  deleteClient(id: number) {
    if (!confirm('Delete this client?')) return;
    this.api.deleteClient(id).subscribe(() => this.loadClients());
  }

  onClientImageChange(event: any) {

    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
      this.showToast('Only JPG, PNG, or WEBP images allowed', 'danger');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.showToast('File size must be less than 1MB', 'danger');
      event.target.value = '';
      return;
    }

    this.selectedClientFile = file;

    const reader = new FileReader();
    reader.onload = () => this.clientPreview = reader.result as string;
    reader.readAsDataURL(file);
  }


  resetClient() {
    this.isClientEditing = false;
    this.clientForm = {
      id: null,
      name: '',
      sort_order: 0,
      is_active: 1
    };
    this.clientPreview = null;
    this.selectedClientFile = null;
  }


  /* ===================================================== */
  /* ================= SERVICES =========================== */
  /* ===================================================== */

  loadServices() {
    this.servicesApi.getAdminList().subscribe((res: FmcgService[]) => {
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
    this.selectedServiceFile = null;

    new bootstrap.Modal(document.getElementById('serviceModal')).show();
  }

  onServiceFileChange(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

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

  saveService() {

    const formData = new FormData();

    Object.keys(this.serviceForm).forEach(key => {
      formData.append(key, this.serviceForm[key] ?? '');
    });

    if (this.selectedServiceFile)
      formData.append('image', this.selectedServiceFile);

    const request$ = this.isServiceEditing
      ? this.servicesApi.updateService(this.serviceForm.id, formData)
      : this.servicesApi.createService(formData);

    request$.subscribe({
      next: () => {
        this.showToast('Service saved successfully', 'success');
        this.loadServices();
        bootstrap.Modal
          .getInstance(document.getElementById('serviceModal')!)
          ?.hide();
      },
      error: (err: any) => {
        this.showToast(err?.error?.message || 'Save failed', 'danger');
      }
    });
  }


  toggleService(id: number) {
    this.servicesApi.toggleService(id).subscribe(() => {
      this.loadServices();
    });
  }

  goToServiceDetail(service: any) {
    this.router.navigate([
      '/dashboard/fmcg-service-detail',
      service.id
    ]);
  }


  openServiceDeleteModal(id: number) {
    this.deleteServiceId = id;
    new bootstrap.Modal(document.getElementById('serviceDeleteModal')).show();
  }

  confirmServiceDelete() {
    if (!this.deleteServiceId) return;

    this.servicesApi.deleteService(this.deleteServiceId).subscribe(() => {
      this.showToast('Deleted successfully', 'success');
      this.loadServices();
      bootstrap.Modal
        .getInstance(document.getElementById('serviceDeleteModal')!)
        ?.hide();
    });
  }

  resetServiceForm() {
    this.isServiceEditing = false;
    this.serviceForm = {
      id: null,
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      sort_order: 0,
      is_active: 1
    };
    this.selectedServiceFile = null;
    this.servicePreview = null;
  }


}
