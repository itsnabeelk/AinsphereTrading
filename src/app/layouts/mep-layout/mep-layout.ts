import { Component } from '@angular/core';
import { MEPFooter } from "../../shared-footer/mep-footer/mep-footer";
import { RouterOutlet } from '@angular/router';
import { HeaderMEP } from "../../shared-headers/header-mep/header-mep";

@Component({
  selector: 'app-mep-layout',
  imports: [RouterOutlet, MEPFooter, HeaderMEP],
  templateUrl: './mep-layout.html',
  styleUrl: './mep-layout.css',
})
export class MepLayout {

}
