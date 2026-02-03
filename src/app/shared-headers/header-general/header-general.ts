import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-general',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-general.html',
  styleUrl: './header-general.css',
})
export class HeaderGeneral {

  /* =========================
     Hamburger Menu
  ========================= */

  openHamburger() {
    document.querySelector('.hamburger-area')?.classList.add('opened');
    document.querySelector('.body-overlay')?.classList.add('opened');
    document.body.classList.toggle('overflow-hidden');
  }

  closeHamburger() {
    document.querySelector('.hamburger-area')?.classList.remove('opened');
    document.querySelector('.body-overlay')?.classList.remove('opened');
    document.body.classList.toggle('overflow-hidden');
  }

  /* =========================
     Search Popup
  ========================= */

  openSearch() {
    document.querySelector('.search_popup')?.classList.add('search-opened');
    document
      .querySelector('.search-popup-overlay')
      ?.classList.add('search-popup-overlay-open');
  }

  closeSearch() {
    document.querySelector('.search_popup')?.classList.remove('search-opened');
    document
      .querySelector('.search-popup-overlay')
      ?.classList.remove('search-popup-overlay-open');
  }
}
