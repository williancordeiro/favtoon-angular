import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from "../../atividade11/header/header.component";
import { FooterComponent } from "../../atividade11/footer/footer.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index11',
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './index11.component.html',
  styleUrl: './index11.component.css',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class Index11Component {

}
