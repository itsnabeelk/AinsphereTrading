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
}
