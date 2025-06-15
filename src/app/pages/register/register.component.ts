import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

//Componentes
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RegisterFormComponent } from "../../components/register-form/register-form.component";

@Component({
  selector: 'app-register',
  imports: [RegisterFormComponent , RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

}
