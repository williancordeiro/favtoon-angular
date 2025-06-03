import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Service } from '../../../api/service';
import { Router } from '@angular/router';
import bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register-form',
  imports: [ FormsModule ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {

  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  router: Router = new Router;

  constructor(private service: Service) {}

  errorMessage: string = '';

  onSubmit() {
    if (!this.user.name || !this.user.email || !this.user.password || !this.user.confirmPassword) {
      this.errorMessage = `<p class="warning">All fields are required!</p>`;
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = `<p class="warning">Passwords not correspond</p>`
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(this.user.password, salt);

    const newUser = {
      name: this.user.name,
      email: this.user.email,
      password: passwordHash
    };

    this.service.createUser(newUser).subscribe(response => {
      alert('User registered successfully!');
      this.router.navigate(['/index']);
    })
  }
 }
