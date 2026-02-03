import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderGeneral } from "../../shared-headers/header-general/header-general";
import { GeneralFooter } from "../../shared-footer/general-footer/general-footer";

@Component({
  selector: 'app-general-layout',
  imports: [RouterOutlet, HeaderGeneral, GeneralFooter],
  templateUrl: './general-layout.html',
  styleUrl: './general-layout.css',
})
export class GeneralLayout {

}
