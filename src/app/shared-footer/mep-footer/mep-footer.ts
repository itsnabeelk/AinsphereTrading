import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mep-footer',
  imports: [RouterLink],
  templateUrl: './mep-footer.html',
  styleUrl: './mep-footer.css',
})
export class MEPFooter {
  currentLang: 'en' | 'ar' = 'en';

  ngOnInit() {
    const saved = localStorage.getItem('lang');
    this.currentLang = (saved as 'en' | 'ar') || 'en';
  }
}