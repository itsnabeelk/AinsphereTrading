import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare function manJs(): void;
@Component({
  selector: 'app-uniform-services',
  imports: [RouterLink],
  templateUrl: './uniform-services.html',
  styleUrl: './uniform-services.css',
})
export class UniformServices {
  ngOnInit() {
    manJs();
  }
}
