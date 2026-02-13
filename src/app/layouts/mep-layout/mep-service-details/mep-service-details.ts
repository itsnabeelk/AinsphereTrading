import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare function manJs(): void;
@Component({
  selector: 'app-mep-service-details',
  imports: [RouterLink],
  templateUrl: './mep-service-details.html',
  styleUrl: './mep-service-details.css',
})
export class MepServiceDetails {
  ngOnInit() {
    manJs();
  }
}
