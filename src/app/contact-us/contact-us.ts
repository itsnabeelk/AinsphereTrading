import { Component } from '@angular/core';
import { GeneralFooter } from "../shared-footer/general-footer/general-footer";
import { HeaderGeneral } from "../shared-headers/header-general/header-general";
@Component({
  selector: 'app-contact-us',
  imports: [GeneralFooter, HeaderGeneral],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs {

}
