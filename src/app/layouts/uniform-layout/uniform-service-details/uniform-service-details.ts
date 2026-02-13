import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare function manJs(): void;
@Component({
  selector: 'app-uniform-service-details',
  imports: [RouterLink],
  templateUrl: './uniform-service-details.html',
  styleUrl: './uniform-service-details.css',
})
export class UniformServiceDetails {
  ngOnInit() {
    manJs();
  }
}
