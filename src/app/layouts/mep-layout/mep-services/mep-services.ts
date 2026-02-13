import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare function manJs(): void;
@Component({
  selector: 'app-mep-services',
  imports: [RouterLink],
  templateUrl: './mep-services.html',
  styleUrl: './mep-services.css',
})
export class MepServices {
  ngOnInit() {
    manJs();
  }
}
