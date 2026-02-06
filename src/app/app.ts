import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreLoader } from "./pre-loader/pre-loader";
declare function manJs(): void;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PreLoader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  ngOnInit(): void {
    manJs();
  }
}
