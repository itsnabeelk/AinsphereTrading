import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
declare function manJs(): void;
@Component({
  selector: 'app-general-services',
  imports: [RouterLink],
  templateUrl: './general-services.html',
  styleUrl: './general-services.css',
})
export class GeneralServices {
  ngOnInit() {
    manJs();
  }
}
