import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UniformHomeService } from '../../../service/uniform-home.service';
import { UniformServicesService } from '../../../service/uniform-services.service';
declare var bootstrap: any;

@Component({
  selector: 'app-uniform-dashboard-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './uniform-dashboard-home.html',
  styleUrl: './uniform-dashboard-home.css'
})
export class UniformDashboardHome implements OnInit {

  loading = true;
  MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  /* ================= HERO ================= */

  heroSlides: any[] = [];
  heroForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',   // ADD THIS
    button_text_en: '',
    button_text_ar: '',
    button_link: '',
    sort_order: 0,
    is_active: 1
  };

  heroPreview: string | null = null;
  selectedHeroFile: File | null = null;
  isHeroEditing = false;

  /* ================= ABOUT ================= */

  aboutForm: any = {
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    brochure_en: '',
    brochure_ar: ''
  };

  aboutPreview: string | null = null;
  selectedAboutFile: File | null = null;

  /* ================= CLIENT ================= */

  clients: any[] = [];
  clientForm: any = {
    id: null,
    sort_order: 0,
    is_active: 1
  };

  clientPreview: string | null = null;
  selectedClientFile: File | null = null;
  isClientEditing = false;

  /* ================= WORKING ================= */

  working: any[] = [];
  workingForm: any = {
    id: null,
    sort_order: 1,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    is_active: 1
  };

  /* ================= MISSION ================= */

  missionForm: any = {
    title_en: '',
    title_ar: '',
    sub_title_en: '',
    sub_title_ar: '',
    banner_image: '',

    contact_title_en: '',
    contact_title_ar: '',
    contact_button_en: '',
    contact_button_ar: '',

    vision_title_en: '',
    vision_title_ar: '',
    vision_text_en: '',
    vision_text_ar: '',

    mission_title_en: '',
    mission_title_ar: '',
    mission_text_en: '',
    mission_text_ar: ''
  };
  missionPreview: string | null = null;
  selectedMissionFile: File | null = null;


  services: any[] = [];

  serviceForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: ''
  };

  selectedServiceFile: File | null = null;
  servicePreview: string | null = null;
  isServiceEditing = false;
  deleteServiceId: number | null = null;
  selectedAboutBrochureEn: File | null = null;
  selectedAboutBrochureAr: File | null = null;
  aboutBrochureEnPreview: string | null = null;
  aboutBrochureArPreview: string | null = null;
  constructor(
    private router: Router,
    private api: UniformHomeService,
    private serviceApi: UniformServicesService
  ) { }

  ngOnInit(): void {
    this.loadAll();
    this.loadServices();
  }

  loadAll() {
    this.loadHero();
    this.loadAbout();
    this.loadClients();
    this.loadWorking();
    this.loadMission();
  }

  getImage(path: string | null) {
    return this.api.getImage(path);
  }

  goBack() {
    this.router.navigate(['/dashboard/uniform-dashboard']);
  }

  /* ================= FILE VALIDATION ================= */

  validateFile(file: File): boolean {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.showToast('Only JPG, PNG, WEBP allowed', 'danger');
      return false;
    }
    if (file.size > this.MAX_FILE_SIZE) {
      this.showToast('Image must be under 2MB', 'danger');
      return false;
    }
    return true;
  }

  /* ================= HERO ================= */

  loadHero() {
    this.api.getHeroAdmin().subscribe({
      next: res => {
        this.heroSlides = res || [];
        this.loading = false;
      },
      error: () => this.showToast('Failed to load hero', 'danger')
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
    Object.keys(this.heroForm).forEach(key =>
      formData.append(key, this.heroForm[key] ?? '')
    );

    if (this.selectedHeroFile)
      formData.append('image', this.selectedHeroFile);

    this.api.saveHero(formData).subscribe({
      next: () => {
        this.loadHero();
        bootstrap.Modal.getInstance(document.getElementById('heroModal')!)?.hide();
        this.resetHero();
        this.showToast('Hero saved successfully', 'success');
      },
      error: err => this.showToast(err?.error?.message || 'Hero save failed', 'danger')
    });
  }

  deleteHero(id: number) {
    this.api.deleteHero(id).subscribe({
      next: () => {
        this.loadHero();
        this.showToast('Hero deleted', 'success');
      },
      error: () => this.showToast('Delete failed', 'danger')
    });
  }

  onHeroImageChange(event: any) {
    const file = event.target.files[0];
    if (!file || !this.validateFile(file)) return;

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

  /* ================= ABOUT ================= */

  loadAbout() {
    this.api.getAboutAdmin().subscribe({
      next: (res: any) => {
        if (res) {
          this.aboutForm = { ...res };

          this.aboutPreview = res.image ? this.getImage(res.image) : null;

          this.aboutBrochureEnPreview = res?.brochure_en
            ? this.getFile(res.brochure_en)
            : null;

          this.aboutBrochureArPreview = res?.brochure_ar
            ? this.getFile(res.brochure_ar)
            : null;
        }
      },
      error: () => this.showToast('Failed to load about', 'danger')
    });
  }

  saveAbout() {
    const formData = new FormData();

    Object.keys(this.aboutForm).forEach(key => {
      formData.append(key, this.aboutForm[key] ?? '');
    });

    if (this.selectedAboutFile) formData.append('image', this.selectedAboutFile);

    if (this.selectedAboutBrochureEn) formData.append('brochure_en', this.selectedAboutBrochureEn);

    if (this.selectedAboutBrochureAr) formData.append('brochure_ar', this.selectedAboutBrochureAr);

    this.api.saveAbout(formData).subscribe({
      next: () => {
        this.showToast('About updated', 'success');
        this.loadAbout();
      },
      error: (err: any) => this.showToast(err?.error?.message || 'About save failed', 'danger')
    });
  }


  onAboutBrochureEnChange(event: any) {
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

    this.selectedAboutBrochureEn = file;
    this.aboutBrochureEnPreview = URL.createObjectURL(file);
  }

  onAboutBrochureArChange(event: any) {
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

    this.selectedAboutBrochureAr = file;
    this.aboutBrochureArPreview = URL.createObjectURL(file);
  }

  getFile(path: string | null) {
    return this.api.getFile(path);
  }

  onAboutImageChange(event: any) {
    const file = event.target.files[0];
    if (!file || !this.validateFile(file)) return;

    this.selectedAboutFile = file;
    const reader = new FileReader();
    reader.onload = () => this.aboutPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  /* ================= CLIENT ================= */

  loadClients() {
    this.api.getClientsAdmin().subscribe({
      next: res => this.clients = res || [],
      error: () => this.showToast('Failed to load clients', 'danger')
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
    Object.keys(this.clientForm).forEach(key =>
      formData.append(key, this.clientForm[key] ?? '')
    );

    if (this.selectedClientFile)
      formData.append('image', this.selectedClientFile);

    const request = this.isClientEditing
      ? this.api.updateClient(this.clientForm.id, formData)
      : this.api.createClient(formData);

    request.subscribe({
      next: () => {
        this.loadClients();
        bootstrap.Modal.getInstance(document.getElementById('clientModal')!)?.hide();
        this.resetClient();
        this.showToast('Client saved', 'success');
      },
      error: () => this.showToast('Client save failed', 'danger')
    });
  }

  deleteClient(id: number) {
    this.api.deleteClient(id).subscribe({
      next: () => {
        this.loadClients();
        this.showToast('Client deleted', 'success');
      },
      error: () => this.showToast('Delete failed', 'danger')
    });
  }

  onClientImageChange(event: any) {
    const file = event.target.files[0];
    if (!file || !this.validateFile(file)) return;

    this.selectedClientFile = file;
    const reader = new FileReader();
    reader.onload = () => this.clientPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  resetClient() {
    this.isClientEditing = false;
    this.clientForm = {
      id: null,
      sort_order: 0,
      is_active: 1
    };
    this.clientPreview = null;
    this.selectedClientFile = null;
  }

  /* ================= WORKING ================= */

  loadWorking() {
    this.api.getWorkingAdmin().subscribe({
      next: res => this.working = res || [],
      error: () => this.showToast('Failed to load working process', 'danger')
    });
  }

  saveWorking() {
    const request = this.workingForm.id
      ? this.api.updateWorking(this.workingForm.id, this.workingForm)
      : this.api.createWorking(this.workingForm);

    request.subscribe({
      next: () => {
        this.loadWorking();
        this.resetWorking();

        bootstrap.Modal.getInstance(
          document.getElementById('workingModal')!
        )?.hide();

        this.showToast('Working step saved', 'success');
      },
      error: () => this.showToast('Working save failed', 'danger')
    });
  }
  deleteWorking(id: number) {
    this.api.deleteWorking(id).subscribe({
      next: () => {
        this.loadWorking();
        this.showToast('Working deleted', 'success');
      },
      error: () => this.showToast('Delete failed', 'danger')
    });
  }

  resetWorking() {
    this.workingForm = {
      id: null,
      sort_order: 1,
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      is_active: 1
    };
  }

  /* ================= MISSION ================= */

  loadMission() {
    this.api.getMissionAdmin().subscribe({
      next: res => {
        if (!res) return;

        this.missionForm = {
          ...res,

          // 🔥 IMPORTANT mapping
          vision_text_en: res.vision_desc_en || '',
          vision_text_ar: res.vision_desc_ar || '',
          mission_text_en: res.mission_desc_en || '',
          mission_text_ar: res.mission_desc_ar || '',
        };

        // 🔥 image preview
        if (res.banner_image) {
          this.missionPreview = this.getImage(res.banner_image);
        }
      },
      error: () => this.showToast('Failed to load mission', 'danger')
    });
  }
  saveMission() {
    const formData = new FormData();

    const payload = {
      title_en: this.missionForm.title_en,
      title_ar: this.missionForm.title_ar,
      sub_title_en: this.missionForm.sub_title_en,
      sub_title_ar: this.missionForm.sub_title_ar,
      contact_title_en: this.missionForm.contact_title_en,
      contact_title_ar: this.missionForm.contact_title_ar,

      vision_title_en: this.missionForm.vision_title_en,
      vision_title_ar: this.missionForm.vision_title_ar,
      vision_desc_en: this.missionForm.vision_text_en,
      vision_desc_ar: this.missionForm.vision_text_ar,

      mission_title_en: this.missionForm.mission_title_en,
      mission_title_ar: this.missionForm.mission_title_ar,
      mission_desc_en: this.missionForm.mission_text_en,
      mission_desc_ar: this.missionForm.mission_text_ar,
    };

    Object.keys(payload).forEach(key => {
      formData.append(
        key,
        payload[key as keyof typeof payload] ?? ''
      );
    });

    if (this.selectedMissionFile) {
      formData.append('banner_image', this.selectedMissionFile);
    }

    this.api.saveMission(formData).subscribe({
      next: () => this.showToast('Saved', 'success'),
      error: () => this.showToast('Error', 'danger')
    });
  }
  /* ================= TOAST ================= */

  showToast(message: string, type: 'success' | 'danger') {
    const toastEl = document.getElementById('uniformToast');
    const toastBody = document.getElementById('uniformToastBody');
    if (!toastEl || !toastBody) return;

    toastBody.innerText = message;
    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');

    new bootstrap.Toast(toastEl).show();
  }


  /* ================= DELETE MODAL ================= */

  deleteType: 'hero' | 'client' | 'working' | null = null;
  deleteId: number | null = null;

  openDeleteModal(type: 'hero' | 'client' | 'working', id: number) {
    this.deleteType = type;
    this.deleteId = id;

    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  }

  confirmDelete() {
    if (!this.deleteType || !this.deleteId) return;

    let request;

    switch (this.deleteType) {
      case 'hero':
        request = this.api.deleteHero(this.deleteId);
        break;
      case 'client':
        request = this.api.deleteClient(this.deleteId);
        break;
      case 'working':
        request = this.api.deleteWorking(this.deleteId);
        break;
    }

    request?.subscribe({
      next: () => {
        if (this.deleteType === 'working') this.loadWorking();
        if (this.deleteType === 'hero') this.loadHero();
        if (this.deleteType === 'client') this.loadClients();
        this.showToast('Deleted successfully', 'success');
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')!)?.hide();
      },
      error: () => this.showToast('Delete failed', 'danger')
    });
  }

  openWorkingModal() {
    this.resetWorking();
    new bootstrap.Modal(document.getElementById('workingModal')).show();
  }

  editWorking(item: any) {
    this.workingForm = { ...item };
    new bootstrap.Modal(document.getElementById('workingModal')).show();
  }
  onMissionImageChange(event: any) {
    const file = event.target.files[0];
    if (!file || !this.validateFile(file)) return;

    this.selectedMissionFile = file;

    const reader = new FileReader();
    reader.onload = () => this.missionPreview = reader.result as string;
    reader.readAsDataURL(file);
  }


  /* ================= SERVICES ================= */

  loadServices() {
    this.serviceApi.getAdmin().subscribe(res => {
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
        this.loadServices();
        bootstrap.Modal.getInstance(document.getElementById('serviceModal')!)?.hide();
        this.resetServiceForm();
        this.showToast('Service saved', 'success');
      },
      error: err => this.showToast(err?.error?.message || 'Save failed', 'danger')
    });
  }

  openServiceDeleteModal(id: number) {
    this.deleteServiceId = id;
    new bootstrap.Modal(document.getElementById('serviceDeleteModal')).show();
  }

  confirmServiceDelete() {
    if (!this.deleteServiceId) return;

    this.serviceApi.delete(this.deleteServiceId).subscribe({
      next: () => {
        this.loadServices();
        this.showToast('Deleted', 'success');
        bootstrap.Modal.getInstance(document.getElementById('serviceDeleteModal')!)?.hide();
      },
      error: () => this.showToast('Delete failed', 'danger')
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
    if (!file || !this.validateFile(file)) return;

    this.selectedServiceFile = file;

    const reader = new FileReader();
    reader.onload = () => this.servicePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  goToServiceDetail(service: any) {
    this.router.navigate(['/dashboard/uniform-service-detail', service.id]);
  }

  toggleServiceStatus(service: any) {
    const newStatus = service.is_active ? 0 : 1;

    this.serviceApi.toggleStatus(service.id, newStatus).subscribe({
      next: () => {
        service.is_active = newStatus;
        this.showToast('Status updated', 'success');
      },
      error: () => this.showToast('Update failed', 'danger')
    });
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