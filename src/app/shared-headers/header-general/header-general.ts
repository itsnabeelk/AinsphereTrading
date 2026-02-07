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

  closeHamburger() {
    document.querySelector('.hamburger-area')?.classList.remove('opened');
    document.querySelector('.body-overlay')?.classList.remove('opened');
    document.body.classList.remove('overflow-hidden');
  }
}
