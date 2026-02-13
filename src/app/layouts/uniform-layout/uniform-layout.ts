import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UNIFORMSFooter } from "../../shared-footer/uniforms-footer/uniforms-footer";
import { HeaderUNIFORMS } from "../../shared-headers/header-uniforms/header-uniforms";


@Component({
  selector: 'app-uniform-layout',
  imports: [RouterOutlet, UNIFORMSFooter, HeaderUNIFORMS],
  templateUrl: './uniform-layout.html',
  styleUrl: './uniform-layout.css',
})
export class UniformLayout {

}
