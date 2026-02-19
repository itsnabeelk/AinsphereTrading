import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MepServiceDetailService } from '../../../../service/mep-service-detail.service';

declare var bootstrap: any;

@Component({
  selector: 'app-mep-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mep-service-detail.html',
  styleUrl: './mep-service-detail.css',
})
export class MepServiceDetail implements OnInit {

  serviceId!: number;
  loading = true;

  /* ================= MAIN DETAIL ================= */

  detailForm: any = {
    service_id: null,
    main_heading_en: '',
    main_heading_ar: '',
    sub_heading_en: '',
    sub_heading_ar: '',
    is_active: 1
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
  deleteType: 'section' | 'point' | 'product' | null = null
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceApi: MepServiceDetailService
  ) { }

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  /* ================= LOAD ALL ================= */

  loadAll() {
    this.loadDetail();
  }

  getImage(path: string | null) {
    return this.serviceApi.getImage(path);
  }

  goBack() {
    this.router.navigate(['/dashboard/mep-dashboard-home']);
  }

  /* ================= DETAIL ================= */

  loadDetail() {
    this.serviceApi.getAdmin(this.serviceId).subscribe({
      next: (res: any) => {

        if (res) {
          this.detailForm = res.detail || {};

          this.sections = res.sections || [];
          this.points = res.points || [];
          this.products = res.products || [];

          this.heroPreview = res.detail?.hero_image
            ? this.getImage(res.detail.hero_image)
            : null;
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }


  saveDetail() {

    const formData = new FormData();
    this.detailForm.service_id = this.serviceId;

    Object.keys(this.detailForm).forEach(key => {
      formData.append(key, this.detailForm[key] ?? '');
    });

    if (this.selectedHeroFile) {
      formData.append('hero_image', this.selectedHeroFile);
    }

    this.serviceApi.saveDetail(this.serviceId, formData)
      .subscribe({
        next: () => this.showToast('Detail saved successfully', 'success'),
        error: (err) => this.showToast(err?.error?.message || 'Something went wrong', 'error')
      });

  }

  onHeroImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedHeroFile = file;

    const reader = new FileReader();
    reader.onload = () => this.heroPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  /* ================= SECTIONS ================= */

  loadSections() {
    this.serviceApi.getSections(this.serviceId)
      .subscribe(res => this.sections = res || []);
  }



  editSection(section: any) {
    this.isSectionEditing = true;
    this.sectionForm = { ...section };
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

  /* ================= POINTS ================= */

  loadPoints() {
    this.serviceApi.getPoints(this.serviceId)
      .subscribe(res => this.points = res || []);
  }

  confirmDelete() {

    if (!this.deleteId || !this.deleteType) return;

    let request;

    if (this.deleteType === 'section') {
      request = this.serviceApi.deleteSection(this.deleteId);
    } else if (this.deleteType === 'point') {
      request = this.serviceApi.deletePoint(this.deleteId);
    } else {
      request = this.serviceApi.deleteProduct(this.deleteId);
    }

    request.subscribe({
      next: () => {
        this.loadDetail();
        this.showToast('Deleted successfully', 'success');

        bootstrap.Modal.getInstance(
          document.getElementById('deleteModal')
        )?.hide();

        // ✅ reset state
        this.deleteId = null;
        this.deleteType = null;
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Delete failed', 'error');
      }
    });
  }


  saveSection() {

    const payload = {
      ...this.sectionForm,
      service_id: this.serviceId
    };

    const request = this.isSectionEditing
      ? this.serviceApi.updateSection(this.sectionForm.id, payload)
      : this.serviceApi.createSection(this.serviceId, payload);

    request.subscribe({
      next: () => {
        this.loadSections();
        this.resetSection();
        this.showToast(
          this.isSectionEditing ? 'Section updated successfully' : 'Section created successfully',
          'success'
        );
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Save failed', 'error');
      }
    });
  }


  savePoint() {

    const payload = {
      ...this.pointForm,
      service_id: this.serviceId,
      points_en: this.pointForm.points_en,
      points_ar: this.pointForm.points_ar
    };

    const request = this.isPointEditing
      ? this.serviceApi.updatePoint(this.pointForm.id, payload)
      : this.serviceApi.createPoint(this.serviceId, payload);

    request.subscribe({
      next: () => {
        this.loadPoints();
        this.resetPoint();
        this.showToast(
          this.isPointEditing ? 'Point group updated successfully' : 'Point group created successfully',
          'success'
        );
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Save failed', 'error');
      }
    });
  }


  editPoint(point: any) {
    this.isPointEditing = true;
    this.pointForm = {
      ...point,
      points_en: (point.points_en || []).join('\n'),
      points_ar: (point.points_ar || []).join('\n')
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

  /* ================= PRODUCTS ================= */

  loadProducts() {
    this.serviceApi.getProducts(this.serviceId)
      .subscribe(res => this.products = res || []);
  }

  openProductModal() {
    this.resetProduct();
    new bootstrap.Modal(document.getElementById('productModal')).show();
  }

  editProduct(product: any) {
    this.isProductEditing = true;
    this.productForm = { ...product };
    this.productPreview = product.image
      ? this.getImage(product.image)
      : null;

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
      ? this.serviceApi.updateProduct(this.productForm.id, formData)
      : this.serviceApi.createProduct(this.serviceId, formData);

    request.subscribe(() => {
      this.loadProducts();
      this.resetProduct();
      bootstrap.Modal.getInstance(
        document.getElementById('productModal')
      )?.hide();
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

  showToast(message: string, type: 'success' | 'error' = 'success') {

    const toastEl = document.getElementById('mepToast');
    const toastBody = document.getElementById('mepToastBody');

    if (!toastEl || !toastBody) return;

    toastBody.innerText = message;

    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');

    new bootstrap.Toast(toastEl).show();
  }

  openDeleteModal(id: number, type: 'section' | 'point' | 'product') {
    this.deleteId = id;
    this.deleteType = type;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  }


}
