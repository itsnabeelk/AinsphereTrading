import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-header-mep',
  imports: [RouterLink],
  templateUrl: './header-mep.html',
  styleUrl: './header-mep.css',
})
export class HeaderMEP {
  closeHamburger() {
    document.querySelector('.hamburger-area')?.classList.remove('opened');
    document.querySelector('.body-overlay')?.classList.remove('opened');
    document.body.classList.remove('overflow-hidden');
  }
}
