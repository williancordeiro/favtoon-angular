import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { HomeHeaderComponent } from "../../components/home-header/home-header.component";
import { HomeComponent } from "../home/home.component";
import { ProfileComponent } from "../profile/profile.component";

@Component({
  selector: 'app-index',
  imports: [FooterComponent, HomeHeaderComponent ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

}
