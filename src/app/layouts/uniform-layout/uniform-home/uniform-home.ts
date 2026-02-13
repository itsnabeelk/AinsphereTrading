import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare function manJs(): void;
@Component({
  selector: 'app-uniform-home',
  imports: [RouterLink],
  templateUrl: './uniform-home.html',
  styleUrl: './uniform-home.css',
})
export class UniformHome {
  ngOnInit() {
    manJs();
  }
}
