import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MepHomeService } from '../../../service/mep-home.service';
import { MepServicesService } from '../../../service/mep-services.service';

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

  hero: any = {};
  heroPreview: string | null = null;
  selectedHeroFile: File | null = null;

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


  constructor(
    private api: MepHomeService,
    private serviceApi: MepServicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAll();
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
    this.api.getHeroAdmin().subscribe(res => {
      this.hero = res || {};
      this.heroPreview = res?.image ? this.getImage(res.image) : null;
      this.loading = false;
    });
  }

  saveHero() {

    const formData = new FormData();

    Object.keys(this.hero).forEach(key => {
      formData.append(key, this.hero[key] ?? '');
    });

    if (this.selectedHeroFile)
      formData.append('image', this.selectedHeroFile);

    this.api.saveHero(formData).subscribe({
      next: (res: any) => {
        this.showToast(res?.message || 'Hero saved successfully', 'success');
        this.loadHero();
      },
      error: (err: any) => {

        this.showToast(err?.error?.message || 'Failed to save hero', 'danger');
      }
    });
  }

  /* ===================================================== */
  /* ================= ABOUT ============================== */
  /* ===================================================== */

  loadAbout() {
    this.api.getAboutAdmin().subscribe(res => {
      this.about = res || {};
      this.aboutPreview = res?.image ? this.getImage(res.image) : null;
    });
  }

  saveAbout() {

    const formData = new FormData();

    Object.keys(this.about).forEach(key => {
      formData.append(key, this.about[key] ?? '');
    });

    if (this.selectedAboutFile)
      formData.append('image', this.selectedAboutFile);

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


  onHeroFileChange(event: any) {

    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

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

    this.selectedHeroFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.heroPreview = reader.result as string;
    };
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


}
