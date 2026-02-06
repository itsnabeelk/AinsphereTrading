import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare function manJs(): void;
@Component({
  selector: 'app-fmcg-services',
  imports: [RouterLink],
  templateUrl: './fmcg-services.html',
  styleUrl: './fmcg-services.css',
})
export class FmcgServices {
  ngOnInit(): void {
    manJs();
  }
}
