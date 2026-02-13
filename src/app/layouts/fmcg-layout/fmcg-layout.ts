import { Component } from '@angular/core';
import { FMCGFooter } from "../../shared-footer/fmcg-footer/fmcg-footer";
import { HeaderFMCG } from "../../shared-headers/header-fmcg/header-fmcg";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fmcg-layout',
  imports: [FMCGFooter, HeaderFMCG, RouterOutlet],
  templateUrl: './fmcg-layout.html',
  styleUrl: './fmcg-layout.css',
})
export class FmcgLayout {

}
