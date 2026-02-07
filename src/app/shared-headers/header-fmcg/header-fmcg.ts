import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-header-fmcg',
  imports: [RouterLink],
  templateUrl: './header-fmcg.html',
  styleUrl: './header-fmcg.css',
})
export class HeaderFMCG {
  closeHamburger() {
    document.querySelector('.hamburger-area')?.classList.remove('opened');
    document.querySelector('.body-overlay')?.classList.remove('opened');
    document.body.classList.remove('overflow-hidden');
  }
}
