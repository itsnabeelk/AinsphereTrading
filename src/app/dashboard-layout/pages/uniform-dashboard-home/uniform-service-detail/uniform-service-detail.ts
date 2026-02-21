import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UniformServiceDetailService } from '../../../../service/uniform-service-detail.service';

declare var bootstrap: any;

@Component({
  selector: 'app-uniform-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './uniform-service-detail.html',
  styleUrl: './uniform-service-detail.css',
})
export class UniformServiceDetail implements OnInit {

  serviceId!: number;
  loading = true;

  /* ================= MAIN DETAIL ================= */

  detailForm: any = {
    main_heading_en: '',
    main_heading_ar: '',
    sub_heading_en: '',
    sub_heading_ar: ''
  };

  heroPreview: string | null = null;
  selectedHeroFile: File | null = null;

  /* ================= SECTIONS ================= */

  sections: any[] = [];
  sectionForm: any = {
    id: null,
    heading_en: '',
    heading_ar: '',
    paragraph_en: '',
    paragraph_ar: '',
    sort_order: 0
  };
  isSectionEditing = false;

  /* ================= POINTS ================= */

  points: any[] = [];
  pointForm: any = {
    id: null,
    small_heading_en: '',
    small_heading_ar: '',
    points_en: '',
    points_ar: '',
    sort_order: 0
  };
  isPointEditing = false;

  /* ================= PRODUCTS ================= */

  products: any[] = [];
  productForm: any = {
    id: null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    sort_order: 0
  };

  selectedProductFile: File | null = null;
  productPreview: string | null = null;
  isProductEditing = false;

  deleteId: number | null = null;
  deleteType: 'section' | 'point' | 'product' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: UniformServiceDetailService
  ) { }

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  /* ================= LOAD ================= */

  loadAll() {
    this.api.getAdmin(this.serviceId).subscribe((res: any) => {
      this.detailForm = res.detail || {};
      this.sections = res.sections || [];
      this.points = res.points || [];
      this.products = res.products || [];

      this.heroPreview = res.detail?.hero_image
        ? this.getImage(res.detail.hero_image)
        : null;

      this.loading = false;
    });
  }

  getImage(path: string | null) {
    return this.api.getImage(path);
  }

  goBack() {
    this.router.navigate(['/dashboard/uniform-dashboard-home']);
  }

  /* ================= DETAIL ================= */

  saveDetail() {
    const formData = new FormData();

    Object.keys(this.detailForm).forEach(key => {
      formData.append(key, this.detailForm[key] ?? '');
    });

    if (this.selectedHeroFile) {
      formData.append('hero_image', this.selectedHeroFile);
    }

    this.api.saveDetail(this.serviceId, formData)
      .subscribe(() => this.showToast('Saved', 'success'));
  }

  onHeroImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedHeroFile = file;

    const reader = new FileReader();
    reader.onload = () => this.heroPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  /* ================= SECTION ================= */

  saveSection() {
    const payload = { ...this.sectionForm, service_id: this.serviceId };

    const request = this.isSectionEditing
      ? this.api.updateSection(this.sectionForm.id, payload)
      : this.api.createSection(this.serviceId, payload);

    request.subscribe(() => {
      this.loadAll();
      this.resetSection();
    });
  }

  editSection(s: any) {
    this.isSectionEditing = true;
    this.sectionForm = { ...s };
  }

  resetSection() {
    this.isSectionEditing = false;
    this.sectionForm = {
      id: null,
      heading_en: '',
      heading_ar: '',
      paragraph_en: '',
      paragraph_ar: '',
      sort_order: 0
    };
  }

  /* ================= POINT ================= */

  savePoint() {
    const payload = {
      ...this.pointForm,
      service_id: this.serviceId
    };

    const request = this.isPointEditing
      ? this.api.updatePoint(this.pointForm.id, payload)
      : this.api.createPoint(this.serviceId, payload);

    request.subscribe(() => {
      this.loadAll();
      this.resetPoint();
    });
  }

  editPoint(p: any) {
    this.isPointEditing = true;
    this.pointForm = {
      ...p,
      points_en: (p.points_en || []).join('\n'),
      points_ar: (p.points_ar || []).join('\n')
    };
  }

  resetPoint() {
    this.isPointEditing = false;
    this.pointForm = {
      id: null,
      small_heading_en: '',
      small_heading_ar: '',
      points_en: '',
      points_ar: '',
      sort_order: 0
    };
  }

  /* ================= PRODUCT ================= */

  openProductModal() {
    this.resetProduct();
    new bootstrap.Modal(document.getElementById('productModal')).show();
  }

  editProduct(p: any) {
    this.isProductEditing = true;
    this.productForm = { ...p };
    this.productPreview = p.image ? this.getImage(p.image) : null;

    new bootstrap.Modal(document.getElementById('productModal')).show();
  }

  saveProduct() {
    const formData = new FormData();

    Object.keys(this.productForm).forEach(key => {
      formData.append(key, this.productForm[key] ?? '');
    });

    formData.append('service_id', this.serviceId.toString());

    if (this.selectedProductFile) {
      formData.append('image', this.selectedProductFile);
    }

    const request = this.isProductEditing
      ? this.api.updateProduct(this.productForm.id, formData)
      : this.api.createProduct(this.serviceId, formData);

    request.subscribe(() => {
      this.loadAll();
      this.resetProduct();
      bootstrap.Modal.getInstance(document.getElementById('productModal'))?.hide();
    });
  }

  resetProduct() {
    this.isProductEditing = false;
    this.productForm = {
      id: null,
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      sort_order: 0
    };
    this.productPreview = null;
    this.selectedProductFile = null;
  }

  onProductImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedProductFile = file;

    const reader = new FileReader();
    reader.onload = () => this.productPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  /* ================= DELETE ================= */

  openDeleteModal(id: number, type: 'section' | 'point' | 'product') {
    this.deleteId = id;
    this.deleteType = type;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  }

  confirmDelete() {
    if (!this.deleteId || !this.deleteType) return;

    let request;

    if (this.deleteType === 'section') {
      request = this.api.deleteSection(this.deleteId);
    } else if (this.deleteType === 'point') {
      request = this.api.deletePoint(this.deleteId);
    } else {
      request = this.api.deleteProduct(this.deleteId);
    }

    request.subscribe(() => {
      this.loadAll();
      bootstrap.Modal.getInstance(document.getElementById('deleteModal'))?.hide();
    });
  }

  /* ================= TOAST ================= */

  showToast(msg: string, type: 'success' | 'danger') {
    const toastEl = document.getElementById('uniformToast');
    const body = document.getElementById('uniformToastBody');

    if (!toastEl || !body) return;

    body.innerText = msg;

    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');

    new bootstrap.Toast(toastEl).show();
  }
}