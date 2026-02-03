import { Component } from '@angular/core';
declare function manJs(): void;
@Component({
  selector: 'app-general-home',
  imports: [],
  templateUrl: './general-home.html',
  styleUrl: './general-home.css',
})
export class GeneralHome {
  ngOnInit(): void {
    manJs();
  }
}
