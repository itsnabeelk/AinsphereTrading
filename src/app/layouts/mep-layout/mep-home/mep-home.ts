import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare function manJs(): void;
@Component({
  selector: 'app-mep-home',
  imports: [RouterLink],
  templateUrl: './mep-home.html',
  styleUrl: './mep-home.css',
})
export class MepHome {
  ngOnInit(): void {
    manJs();
  }
}
