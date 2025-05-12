import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index10',
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './index10.component.html',
  styleUrl: './index10.component.css',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Index10Component {

}
