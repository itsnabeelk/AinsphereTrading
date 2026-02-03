import { Component } from '@angular/core';
import { HeaderGeneral } from "../shared-headers/header-general/header-general";
import { GeneralFooter } from "../shared-footer/general-footer/general-footer"
@Component({
  selector: 'app-career',
  imports: [HeaderGeneral, GeneralFooter],
  templateUrl: './career.html',
  styleUrl: './career.css',
})
export class Career {

}
