import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
declare function manJs(): void;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  ngOnInit(): void {
    manJs();
  }
}
