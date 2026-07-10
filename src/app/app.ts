import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { PreLoader } from "./pre-loader/pre-loader";
import { AuthService } from './service/auth.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

declare function manJs(): void;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PreLoader, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  isDashboardRoute = false;
  showWhatsAppBubble = false;
  currentLang: 'en' | 'ar' = 'en';
  whatsappTheme: 'general' | 'fmcg' | 'mep' | 'uniform' = 'general';
  readonly whatsappLink = 'https://wa.me/+966543612700';

  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit(): void {

    if (typeof manJs === 'function') {
      try {
        manJs();
      } catch {
        // Avoid blocking app bootstrap if theme JS fails in production.
      }
    }
    this.authService.initializeUser();

    // 🔥 Detect dashboard route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        const url = event.url;

        // ❗ disable smooth for dashboard layout only
        this.isDashboardRoute = url.includes('/dashboard');

        this.updateWhatsAppTheme(url);
        this.currentLang = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';
        this.showWhatsAppBubble = false;
        
        // Update SEO Title & Meta Description on navigate
        this.updateSeoTags(url);

      });

    this.currentLang = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';
    this.updateWhatsAppTheme(this.router.url || '');
    this.updateSeoTags(this.router.url || '');
  }

  toggleWhatsAppBubble(event?: Event): void {
    event?.stopPropagation();
    this.showWhatsAppBubble = !this.showWhatsAppBubble;
  }

  closeWhatsAppBubble(event?: Event): void {
    event?.stopPropagation();
    this.showWhatsAppBubble = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.whatsapp-widget')) {
      this.showWhatsAppBubble = false;
    }
  }

  private updateWhatsAppTheme(url: string): void {
    if (url.includes('/fmcg')) {
      this.whatsappTheme = 'fmcg';
      return;
    }

    if (url.includes('/mep')) {
      this.whatsappTheme = 'mep';
      return;
    }

    if (url.includes('/uniform')) {
      this.whatsappTheme = 'uniform';
      return;
    }

    this.whatsappTheme = 'general';
  }

  private updateSeoTags(url: string): void {
    const lang = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';

    let title = '';
    let description = '';
    let ogImage = 'https://ainspheretrading.com/images/logos/logo-dark.png';

    if (url.includes('/dashboard')) {
      title = 'Admin Dashboard | Ainsphere Trading Management';
      description = 'Administrative control panel for Ainsphere Trading website configuration and inquiries.';
    } else if (url.includes('/contact-us')) {
      if (lang === 'ar') {
        title = 'اتصل بنا | المقر الرئيسي لشركة عينسفير للتجارة بالرياض';
        description = 'تواصل مع شركة عينسفير للتجارة بالرياض. استفسر عن خدمات التوريد، التوزيع بالجملة، أو الشراكات التجارية.';
      } else {
        title = 'Contact Us | Ainsphere Trading Riyadh Headquarters';
        description = 'Get in touch with Ainsphere Trading in Riyadh. Inquire about procurement, wholesale supply, or partner services.';
      }
    } else if (url.includes('/career')) {
      if (lang === 'ar') {
        title = 'الوظائف | انضم إلى فريق عمل عينسفير للتجارة';
        description = 'استكشف الفرص الوظيفية المتاحة، قدم طلبك وانضم إلى فريق عمل شركة عينسفير للتجارة.';
      } else {
        title = 'Careers | Join Ainsphere Trading Team';
        description = 'Explore job opportunities, apply for open positions, and grow your career with the Ainsphere Trading team.';
      }
    } else if (url.includes('/fmcg')) {
      ogImage = 'https://ainspheretrading.com/images/logos/logo-dark.webp';
      if (lang === 'ar') {
        title = 'عينسفير للسلع الاستهلاكية | منتجات التجزئة والجملة اليومية عالية الجودة';
        description = 'اكتشف عينسفير للسلع الاستهلاكية سريعة الدوران. نوفر منتجات الأغذية، المشروبات، العناية الشخصية والمنزلية في السعودية.';
      } else {
        title = 'Ainsphere FMCG | High-Quality Everyday Retail & Wholesale Products';
        description = 'Discover Ainsphere FMCG. Supplying premium daily-use foods, beverages, hygiene and household goods across Saudi Arabia.';
      }
    } else if (url.includes('/mep')) {
      if (lang === 'ar') {
        title = 'عينسفير للأعمال الميكانيكية والكهربائية | توريد معدات ومواد الهندسة MEP';
        description = 'توفر عينسفير للأعمال الكهروميكانيكية (MEP) المعدات الميكانيكية والكهربائية والصحية والمواد الصناعية في السعودية.';
      } else {
        title = 'Ainsphere MEP | Engineering Equipment & Materials Procurement';
        description = 'Ainsphere MEP supplies mechanical, electrical, and plumbing engineering components, tools, and industrial materials in KSA.';
      }
    } else if (url.includes('/uniform')) {
      ogImage = 'https://ainspheretrading.com/images/logos/uniform-dark.webp';
      if (lang === 'ar') {
        title = 'عينسفير للزي الموحد | ملابس الشركات والمدارس والزي الصناعي الفاخر';
        description = 'تصمم وتورد عينسفير للزي الموحد ملابس متينة ومخصصة لقطاعات الشركات، المدارس، الرعاية الطبية، والمصانع.';
      } else {
        title = 'Ainsphere Uniforms | Premium Corporate, Commercial & School Apparel';
        description = 'Ainsphere Uniforms designs and supplies high-durability, custom uniforms for corporate, school, medical, and industrial sectors.';
      }
    } else {
      // General / Home
      if (lang === 'ar') {
        title = 'شركة عينسفير للتجارة | حلول التجارة والتوريد المتكاملة في المملكة العربية السعودية';
        description = 'تقدم عينسفير للتجارة خدمات متميزة في مجال التجارة العامة، وإدارة سلاسل الإمداد، والتوريد في الرياض، المملكة العربية السعودية.';
      } else {
        title = 'Ainsphere Trading | Complete Trading & Procurement Solutions in Saudi Arabia';
        description = 'Ainsphere Trading offers top-tier general trading, supply chain management, and procurement services in Riyadh, Saudi Arabia.';
      }
    }

    // Set Title
    this.titleService.setTitle(title);

    // Set or Update Meta Description
    this.updateOrAddMeta('description', description);

    // Set or Update Open Graph Tags
    this.updateOrAddPropertyMeta('og:title', title);
    this.updateOrAddPropertyMeta('og:description', description);
    this.updateOrAddPropertyMeta('og:image', ogImage);
    this.updateOrAddPropertyMeta('og:url', 'https://ainspheretrading.com' + url);
    this.updateOrAddPropertyMeta('og:type', 'website');

    // Set or Update Twitter Cards Tags
    this.updateOrAddMeta('twitter:card', 'summary_large_image');
    this.updateOrAddMeta('twitter:title', title);
    this.updateOrAddMeta('twitter:description', description);
    this.updateOrAddMeta('twitter:image', ogImage);
  }

  private updateOrAddMeta(name: string, content: string): void {
    if (this.metaService.getTag(`name="${name}"`)) {
      this.metaService.updateTag({ name, content });
    } else {
      this.metaService.addTag({ name, content });
    }
  }

  private updateOrAddPropertyMeta(property: string, content: string): void {
    if (this.metaService.getTag(`property="${property}"`)) {
      this.metaService.updateTag({ property, content });
    } else {
      this.metaService.addTag({ property, content });
    }
  }
}
