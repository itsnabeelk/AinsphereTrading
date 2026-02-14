import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralServiceDetailService } from '../../../../service/general-service-detail.service';

declare var bootstrap: any;

@Component({
  selector: 'app-general-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-service-detail.html',
  styleUrl: './general-service-detail.css'
})
export class GeneralServiceDetail implements OnInit {

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceApi: GeneralServiceDetailService
  ) { }

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  /* ================= LOAD ALL ================= */

  loadAll() {
    this.loadDetail();
    this.loadSections();
    this.loadPoints();
    this.loadProducts();
  }

  /* ================= COMMON ================= */

  getImage(path: string | null) {
    return this.serviceApi.getImage(path);
  }

  goBack() {
    this.router.navigate(['/dashboard/general-dashboard-home']);
  }

  /* ================= DETAIL ================= */

  loadDetail() {
    this.serviceApi.getAdminDetail(this.serviceId)
      .subscribe({
        next: res => {
          if (res) {
            this.detailForm = { ...res };
            this.heroPreview = res.hero_image
              ? this.getImage(res.hero_image)
              : null;
          }
          this.loading = false;
        },
        error: err => {
          console.error('Detail load error:', err);
          this.loading = false; // VERY IMPORTANT
        }
      });
  }

  onProductImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedProductFile = file;

    const reader = new FileReader();
    reader.onload = () => this.productPreview = reader.result as string;
    reader.readAsDataURL(file);
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

    this.serviceApi.saveDetail(formData)
      .subscribe(() => alert('Detail Saved'));
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

  saveSection() {
    const payload = {
      ...this.sectionForm,
      service_id: this.serviceId
    };

    const request = this.isSectionEditing
      ? this.serviceApi.updateSection(this.sectionForm.id, payload)
      : this.serviceApi.createSection(payload);

    request.subscribe(() => {
      this.loadSections();
      this.resetSection();
    });
  }

  editSection(section: any) {
    this.isSectionEditing = true;
    this.sectionForm = { ...section };
  }

  deleteSection(id: number) {
    this.serviceApi.deleteSection(id)
      .subscribe(() => this.loadSections());
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

  savePoint() {
    const payload = {
      ...this.pointForm,
      service_id: this.serviceId,
      points_en: JSON.stringify(this.pointForm.points_en.split('\n')),
      points_ar: JSON.stringify(this.pointForm.points_ar.split('\n'))
    };

    const request = this.isPointEditing
      ? this.serviceApi.updatePoint(this.pointForm.id, payload)
      : this.serviceApi.createPoint(payload);

    request.subscribe(() => {
      this.loadPoints();
      this.resetPoint();
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

  deletePoint(id: number) {
    this.serviceApi.deletePoint(id)
      .subscribe(() => this.loadPoints());
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

  deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;

    this.serviceApi.deleteProduct(id)
      .subscribe(() => this.loadProducts());
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
      : this.serviceApi.createProduct(formData);

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

}
