import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-uniforms-footer',
  imports: [RouterLink],
  templateUrl: './uniforms-footer.html',
  styleUrl: './uniforms-footer.css',
})
export class UNIFORMSFooter {
  currentLang: 'en' | 'ar' = 'en';

  ngOnInit() {
    const saved = localStorage.getItem('lang');
    this.currentLang = (saved as 'en' | 'ar') || 'en';
  }

}
