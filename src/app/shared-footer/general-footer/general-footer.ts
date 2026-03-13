import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-general-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './general-footer.html',
  styleUrl: './general-footer.css',
})
export class GeneralFooter implements OnInit {

  currentLang: 'en' | 'ar' = 'en';

  ngOnInit(): void {

    const savedLang = localStorage.getItem('lang');

    if (savedLang === 'ar' || savedLang === 'en') {
      this.currentLang = savedLang;
    } else {
      this.currentLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    }

  }

}