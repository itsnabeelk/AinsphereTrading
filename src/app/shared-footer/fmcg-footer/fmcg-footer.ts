import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fmcg-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './fmcg-footer.html',
  styleUrl: './fmcg-footer.css',
})
export class FMCGFooter implements OnInit {

  isArabic: boolean = false;

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    this.isArabic = lang === 'ar';
  }

}