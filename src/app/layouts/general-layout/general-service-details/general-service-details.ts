import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
declare function manJs(): void;
@Component({
  selector: 'app-general-service-details',
  imports: [RouterLink],
  templateUrl: './general-service-details.html',
  styleUrl: './general-service-details.css',
})
export class GeneralServiceDetails {
  ngOnInit() {
    manJs();
  }
}
