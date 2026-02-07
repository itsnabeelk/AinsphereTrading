import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-uniforms',
  imports: [RouterLink],
  templateUrl: './header-uniforms.html',
  styleUrl: './header-uniforms.css',
})
export class HeaderUNIFORMS {
  closeHamburger() {
    document.querySelector('.hamburger-area')?.classList.remove('opened');
    document.querySelector('.body-overlay')?.classList.remove('opened');
    document.body.classList.remove('overflow-hidden');
  }
}
