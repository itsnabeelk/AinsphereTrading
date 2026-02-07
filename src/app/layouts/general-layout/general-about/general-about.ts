import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare function manJs(): void;
@Component({
  selector: 'app-general-about',
  imports: [RouterLink],
  templateUrl: './general-about.html',
  styleUrl: './general-about.css',
})
export class GeneralAbout {
  ngOnInit() {
    manJs();
  }
}
