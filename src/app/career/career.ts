import { Component, AfterViewInit } from '@angular/core';
import { HeaderGeneral } from "../shared-headers/header-general/header-general";
import { GeneralFooter } from "../shared-footer/general-footer/general-footer";
import { RouterLink } from "@angular/router";

declare function manJs(): void;
declare var bootstrap: any;

@Component({
  selector: 'app-career',
  imports: [HeaderGeneral, GeneralFooter, RouterLink],
  templateUrl: './career.html',
  styleUrl: './career.css',
})
export class Career implements AfterViewInit {

  ngAfterViewInit() {
    manJs();
  }

  openApplyModal(): void {
    const modalEl = document.getElementById('applyJobModal');
    if (!modalEl) return;

    new bootstrap.Modal(modalEl).show();
  }
}
