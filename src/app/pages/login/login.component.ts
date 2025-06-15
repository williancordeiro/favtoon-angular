import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

//Componentes
import { HeaderComponent } from "../../components/header/header.component";
import { LoginFormComponent } from "../../components/login-form/login-form.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
