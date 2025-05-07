import { Component } from '@angular/core';
import { HomeHeaderComponent } from "../../components/home-header/home-header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-profile',
  imports: [HomeHeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
