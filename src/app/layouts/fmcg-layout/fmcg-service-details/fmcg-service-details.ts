import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare function manJs(): void;
@Component({
  selector: 'app-fmcg-service-details',
  imports: [RouterLink],
  templateUrl: './fmcg-service-details.html',
  styleUrl: './fmcg-service-details.css',
})
export class FmcgServiceDetails {
  ngOnInit() {
    manJs();
  }
}
