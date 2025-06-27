import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//Componentes
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, RegisterFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  errorMessage: string = '';

  constructor(private router: Router) {}

  onRegisterSuccess(user: any) {
    this.router.navigate(['/login']);
  }

  onRegisterError(error: string) {
    this.errorMessage = error;
  }
}
