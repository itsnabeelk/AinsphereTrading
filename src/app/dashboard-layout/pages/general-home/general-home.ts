import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralHomeService, GeneralHero } from '../../../service/general-home.service';
import { GeneralClientService } from '../../../service/general-client.service';
import { GeneralAboutService } from '../../../service/general-about.service';
import { GeneralWorkingService, GeneralWorking } from '../../../service/general-working.service';
import { GeneralTeamService, GeneralTeam } from '../../../service/general-team.service';
import { GeneralServicesService, GeneralService } from '../../../service/general-services.service';
import { API_BASE_URL } from '../../../core/api.config';
import { Router } from '@angular/router';
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
  clients: any[] = [];

  /* ================= HERO ================= */
  form: any = { id: null, title_en: '', title_ar: '' };
  previewImage: string | null = null;
  selectedFile: File | null = null;
  isEditing = false;
  deleteId: number | null = null;

  /* ================= CLIENT ================= */
  clientForm: any = { id: null, name: '' };
  clientPreview: string | null = null;
  selectedClientFile: File | null = null;
  isClientEditing = false;
  deleteClientId: number | null = null;

  aboutForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_1_en: '',
    description_1_ar: '',
    description_2_en: '',
    description_2_ar: '',
    brochure_en: '',
    brochure_ar: '',
    is_active: 1
  };
  aboutPreview: string | null = null;
  selectedAboutFile: File | null = null;
  selectedBrochureEn: File | null = null;
  selectedBrochureAr: File | null = null;
  brochureEnPreview: string | null = null;
  brochureArPreview: string | null = null;
  workingItems: GeneralWorking[] = [];

  workingForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    sort_order: 0
  };

  isWorkingEditing = false;
  deleteWorkingId: number | null = null;

  teamMembers: GeneralTeam[] = [];

  teamForm: any = {
    id: null,
    name_en: '',
    name_ar: '',
    designation_en: '',
    designation_ar: '',
    sort_order: 0
  };

  selectedTeamFile: File | null = null;
  teamPreview: string | null = null;
  isTeamEditing = false;
  deleteTeamId: number | null = null;

  /* ================= SERVICES ================= */

  services: GeneralService[] = [];

  serviceForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    sort_order: 0
  };

  selectedServiceFile: File | null = null;
  servicePreview: string | null = null;
  isServiceEditing = false;
  deleteServiceId: number | null = null;

  constructor(
    private heroService: GeneralHomeService,
    private clientService: GeneralClientService,
    private aboutService: GeneralAboutService,
    private workingService: GeneralWorkingService,
    private teamService: GeneralTeamService,
    private servicesService: GeneralServicesService,
    private router: Router
  ) { }


  goToServiceDetail(service: GeneralService) {
    this.router.navigate([
      '/dashboard/general-service-detail',
      service.id
    ]);
  }


  ngOnInit(): void {
    this.loadHeroes();
    this.loadClients();
    this.loadAbout();
    this.loadWorking();
    this.loadTeam();
    this.loadServices();
  }

  /* =====================================================
     COMMON
  ===================================================== */

  getImage(path: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  }

  showToast(message: string, isError: boolean) {
    const toastEl = document.getElementById('generalToast');
    const toastBody = document.getElementById('generalToastBody');

    if (!toastEl || !toastBody) return;

    toastBody.innerText = message;
    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(isError ? 'bg-danger' : 'bg-success');

    new bootstrap.Toast(toastEl, { delay: 3000 }).show();
  }

  /* =====================================================
     HERO SECTION
  ===================================================== */

  loadHeroes() {
    this.heroService.getAdminHero().subscribe(res => {
      this.heroes = res;
    });
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

    if (file.size > 5 * 1024 * 1024)
      return this.showToast('Image must be less than 5MB', true);

    if (!file.type.startsWith('image/'))
      return this.showToast('Only image files allowed', true);

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewImage = reader.result as string;
    reader.readAsDataURL(file);
  }

  saveHero() {
    const formData = new FormData();
    formData.append('title_en', this.form.title_en || '');
    formData.append('title_ar', this.form.title_ar || '');

    if (this.selectedFile)
      formData.append('image', this.selectedFile);

    const request$ = this.isEditing
      ? this.heroService.updateHero(this.form.id, formData)
      : this.heroService.createHero(formData);

    request$.subscribe({
      next: () => {
        this.showToast('Saved successfully', false);
        this.loadHeroes();
        bootstrap.Modal.getInstance(document.getElementById('heroModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Save failed', true);
      }
    });
  }

  openDeleteModal(id: number) {
    this.deleteId = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.heroService.deleteHero(this.deleteId).subscribe({
      next: () => {
        this.showToast('Deleted successfully', false);
        this.loadHeroes();
        bootstrap.Modal.getInstance(document.getElementById('deleteModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Delete failed', true);
      }
    });
  }

  toggleHero(id: number) {
    this.heroService.toggleHero(id).subscribe({
      next: () => this.loadHeroes(),
      error: err => this.showToast(err?.error?.message || 'Toggle failed', true)
    });
  }

  resetForm() {
    this.isEditing = false;
    this.form = { id: null, title_en: '', title_ar: '' };
    this.selectedFile = null;
    this.previewImage = null;
  }

  /* =====================================================
     CLIENT SECTION
  ===================================================== */

  loadClients() {
    this.clientService.getAdminClients().subscribe(res => {
      this.clients = res;
    });
  }

  openClientModal() {
    this.resetClientForm();
    new bootstrap.Modal(document.getElementById('clientModal')).show();
  }

  editClient(client: any) {
    this.isClientEditing = true;
    this.clientForm = { ...client };
    this.clientPreview = this.getImage(client.logo);
    this.selectedClientFile = null;
    new bootstrap.Modal(document.getElementById('clientModal')).show();
  }

  onClientFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024)
      return this.showToast('Logo must be less than 5MB', true);

    if (!file.type.startsWith('image/'))
      return this.showToast('Only image files allowed', true);

    this.selectedClientFile = file;

    const reader = new FileReader();
    reader.onload = () => this.clientPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  saveClient() {
    const formData = new FormData();
    formData.append('name', this.clientForm.name || '');

    if (this.selectedClientFile)
      formData.append('logo', this.selectedClientFile);

    const request$ = this.isClientEditing
      ? this.clientService.updateClient(this.clientForm.id, formData)
      : this.clientService.createClient(formData);

    request$.subscribe({
      next: () => {
        this.showToast('Client saved', false);
        this.loadClients();
        bootstrap.Modal.getInstance(document.getElementById('clientModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Client save failed', true);
      }
    });
  }

  openClientDeleteModal(id: number) {
    this.deleteClientId = id;
    new bootstrap.Modal(document.getElementById('clientDeleteModal')).show();
  }

  confirmClientDelete() {
    if (!this.deleteClientId) return;

    this.clientService.deleteClient(this.deleteClientId).subscribe({
      next: () => {
        this.showToast('Client deleted', false);
        this.loadClients();
        bootstrap.Modal.getInstance(document.getElementById('clientDeleteModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Delete failed', true);
      }
    });
  }

  resetClientForm() {
    this.isClientEditing = false;
    this.clientForm = { id: null, name: '' };
    this.clientPreview = null;
    this.selectedClientFile = null;
  }


  loadAbout() {
    this.aboutService.getAdminAbout().subscribe({
      next: (res: any) => {
        if (!res) return;

        this.aboutForm = { ...res };

        this.aboutPreview = res.image
          ? `${API_BASE_URL}${res.image}`
          : null;

        this.brochureEnPreview = res.brochure_en
          ? `${API_BASE_URL}${res.brochure_en}`
          : null;

        this.brochureArPreview = res.brochure_ar
          ? `${API_BASE_URL}${res.brochure_ar}`
          : null;
      }
    });
  }


  onAboutFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSize) {
      this.showToast('Image must be less than 2MB', true);
      event.target.value = '';
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.showToast('Only PNG, JPG, WEBP allowed', true);
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




  onBrochureEnChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 15 * 1024 * 1024; // 15MB

    if (file.size > maxSize) {
      this.showToast('English brochure must be less than 15MB', true);
      event.target.value = '';
      return;
    }

    if (file.type !== 'application/pdf') {
      this.showToast('Only PDF allowed (English)', true);
      event.target.value = '';
      return;
    }

    this.selectedBrochureEn = file;
    this.brochureEnPreview = URL.createObjectURL(file);
  }


  onBrochureArChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 15 * 1024 * 1024; // 15MB

    if (file.size > maxSize) {
      this.showToast('Arabic brochure must be less than 15MB', true);
      event.target.value = '';
      return;
    }

    if (file.type !== 'application/pdf') {
      this.showToast('Only PDF allowed (Arabic)', true);
      event.target.value = '';
      return;
    }

    this.selectedBrochureAr = file;
    this.brochureArPreview = URL.createObjectURL(file);
  }


  saveAbout() {

    const formData = new FormData();

    Object.keys(this.aboutForm).forEach(key => {
      formData.append(key, this.aboutForm[key] ?? '');
    });

    if (this.selectedAboutFile)
      formData.append('image', this.selectedAboutFile);

    if (this.selectedBrochureEn)
      formData.append('brochure_en', this.selectedBrochureEn);

    if (this.selectedBrochureAr)
      formData.append('brochure_ar', this.selectedBrochureAr);

    this.aboutService.saveAbout(formData).subscribe({
      next: () => {
        this.showToast('About saved successfully', false);
        this.loadAbout();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Save failed', true);
      }
    });
  }

  loadWorking() {
    this.workingService.getAdminWorking().subscribe(res => {
      this.workingItems = res;
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
    const request$ = this.isWorkingEditing
      ? this.workingService.updateWorking(this.workingForm.id, this.workingForm)
      : this.workingService.createWorking(this.workingForm);

    request$.subscribe({
      next: () => {
        this.showToast('Saved successfully', false);
        this.loadWorking();
        bootstrap.Modal.getInstance(document.getElementById('workingModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Save failed', true);
      }
    });
  }

  openWorkingDeleteModal(id: number) {
    this.deleteWorkingId = id;
    new bootstrap.Modal(document.getElementById('workingDeleteModal')).show();
  }

  confirmWorkingDelete() {
    if (!this.deleteWorkingId) return;

    this.workingService.deleteWorking(this.deleteWorkingId).subscribe({
      next: () => {
        this.showToast('Deleted successfully', false);
        this.loadWorking();
        bootstrap.Modal.getInstance(document.getElementById('workingDeleteModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Delete failed', true);
      }
    });
  }

  toggleWorking(id: number) {
    this.workingService.toggleWorking(id).subscribe({
      next: () => this.loadWorking(),
      error: err => this.showToast(err?.error?.message || 'Toggle failed', true)
    });
  }

  resetWorkingForm() {
    this.isWorkingEditing = false;
    this.workingForm = {
      id: null,
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      sort_order: 0
    };
  }

  loadTeam() {
    this.teamService.getAdminTeam().subscribe(res => {
      this.teamMembers = res;
    });
  }

  openTeamModal() {
    this.resetTeamForm();
    new bootstrap.Modal(document.getElementById('teamModal')).show();
  }

  editTeam(member: any) {
    this.isTeamEditing = true;
    this.teamForm = { ...member };
    this.teamPreview = member.image ? this.getImage(member.image) : null;
    this.selectedTeamFile = null;
    new bootstrap.Modal(document.getElementById('teamModal')).show();
  }

  onTeamFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024)
      return this.showToast('Image must be less than 5MB', true);

    if (!file.type.startsWith('image/'))
      return this.showToast('Only image files allowed', true);

    this.selectedTeamFile = file;

    const reader = new FileReader();
    reader.onload = () => this.teamPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  saveTeam() {
    const formData = new FormData();

    Object.keys(this.teamForm).forEach(key => {
      formData.append(key, this.teamForm[key] ?? '');
    });

    if (this.selectedTeamFile)
      formData.append('image', this.selectedTeamFile);

    const request$ = this.isTeamEditing
      ? this.teamService.updateTeam(this.teamForm.id, formData)
      : this.teamService.createTeam(formData);

    request$.subscribe({
      next: () => {
        this.showToast('Team member saved', false);
        this.loadTeam();
        bootstrap.Modal.getInstance(document.getElementById('teamModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Save failed', true);
      }
    });
  }

  openTeamDeleteModal(id: number) {
    this.deleteTeamId = id;
    new bootstrap.Modal(document.getElementById('teamDeleteModal')).show();
  }

  confirmTeamDelete() {
    if (!this.deleteTeamId) return;

    this.teamService.deleteTeam(this.deleteTeamId).subscribe({
      next: () => {
        this.showToast('Deleted successfully', false);
        this.loadTeam();
        bootstrap.Modal.getInstance(document.getElementById('teamDeleteModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Delete failed', true);
      }
    });
  }

  toggleTeam(id: number) {
    this.teamService.toggleTeam(id).subscribe({
      next: () => this.loadTeam(),
      error: err => this.showToast(err?.error?.message || 'Toggle failed', true)
    });
  }

  resetTeamForm() {
    this.isTeamEditing = false;
    this.teamForm = {
      id: null,
      name_en: '',
      name_ar: '',
      designation_en: '',
      designation_ar: '',
      sort_order: 0
    };
    this.selectedTeamFile = null;
    this.teamPreview = null;
  }

  /* =====================================================
   SERVICES SECTION
===================================================== */

  loadServices() {
    this.servicesService.getAdminList().subscribe(res => {
      this.services = res;
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
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      this.showToast('Image must be less than 2MB', true);
      event.target.value = '';
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.showToast('Only PNG, JPG, WEBP allowed', true);
      event.target.value = '';
      return;
    }

    this.selectedServiceFile = file;

    const reader = new FileReader();
    reader.onload = () => this.servicePreview = reader.result as string;
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
      ? this.servicesService.updateService(this.serviceForm.id, formData)
      : this.servicesService.createService(formData);

    request$.subscribe({
      next: () => {
        this.showToast('Service saved successfully', false);
        this.loadServices();
        bootstrap.Modal.getInstance(document.getElementById('serviceModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Save failed', true);
      }
    });
  }

  openServiceDeleteModal(id: number) {
    this.deleteServiceId = id;
    new bootstrap.Modal(document.getElementById('serviceDeleteModal')).show();
  }

  confirmServiceDelete() {
    if (!this.deleteServiceId) return;

    this.servicesService.deleteService(this.deleteServiceId).subscribe({
      next: () => {
        this.showToast('Deleted successfully', false);
        this.loadServices();
        bootstrap.Modal.getInstance(document.getElementById('serviceDeleteModal'))?.hide();
      },
      error: err => {
        this.showToast(err?.error?.message || 'Delete failed', true);
      }
    });
  }

  toggleService(id: number) {
    this.servicesService.toggleService(id).subscribe({
      next: () => this.loadServices(),
      error: err => this.showToast(err?.error?.message || 'Toggle failed', true)
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
      sort_order: 0
    };
    this.selectedServiceFile = null;
    this.servicePreview = null;
  }


}
