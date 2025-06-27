import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//Componentes
import { HeaderComponent } from "../../components/header/header.component";
import { LoginFormComponent } from "../../components/login-form/login-form.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage: string = '';

  constructor(private router: Router) {}

  onLoginSuccess(authData: any) {
    console.log('Login successful:', authData);
    this.router.navigate(['/index/home']);
  }

  onLoginError(error: string) {
    this.errorMessage = error;
  }
}
