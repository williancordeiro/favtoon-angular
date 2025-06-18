import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../../back-end/service/UserService';
import { Router } from '@angular/router';
import bcrypt from 'bcryptjs';
import { NgClass } from '@angular/common';
import { User } from '../../../../back-end/User';

@Component({
  selector: 'app-register-form',
  imports: [ FormsModule, NgClass ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {

  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  invalidInput = {
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  }

  constructor(private service: UserService, private router: Router) {}

  emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");

  passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$");

  errorMessage: string = '';
  errorPassMessage: string = ``;
  errorPassConfiMessage: string = ``;

  onPasswordInput() {
    this.invalidInput.password = !this.user.password;

    let passwordTimeOut: any;

    if (!this.passwordRegex.test(this.user.password)) {
      this.invalidInput.password = true;
      this.errorPassMessage = `
      <ul>
        <li>At least 6 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
        <li>At least one special character</li>
      </ul>
      `;

      clearTimeout(passwordTimeOut);

      passwordTimeOut = setTimeout(() => {
        this.invalidInput.password = false;
        this.errorPassMessage = ``;
      }, 3000);
    } else {
      this.invalidInput.password = false;
      this.errorPassMessage = ``;
      clearTimeout(passwordTimeOut);
    }

  }

  onPassConfirmInput() {
    this.invalidInput.confirmPassword = !this.user.confirmPassword;

    let confirmPasswordTimeOut: any;

    if (this.user.password !== this.user.confirmPassword) {
      this.invalidInput.confirmPassword = true;

      this.errorPassConfiMessage = `<p class="warning">Passwords not correspond</p>`;

      clearTimeout(confirmPasswordTimeOut);

      confirmPasswordTimeOut = setTimeout(() => {
        this.invalidInput.confirmPassword = false;
        this.errorPassConfiMessage = ``;
      }, 3000);
    } else {
      this.invalidInput.confirmPassword = false;
      this.errorPassConfiMessage = ``;
      clearTimeout(confirmPasswordTimeOut);
    }
  }

  onSubmit(form: NgForm) {

    if (form.invalid) {
      this.errorMessage = `<p class="warning">All fields are required!</p>`;

      this.invalidInput = {
        name: !this.user.name,
        email: !this.user.email,
        password: !this.user.password,
        confirmPassword: !this.user.confirmPassword
      }

      setTimeout(() => {
        this.invalidInput = {
          name: false,
          email: false,
          password: false,
          confirmPassword: false
        };
        this.errorMessage = '';
      }, 3000);

      return;
    }

    if (!this.emailRegex.test(this.user.email)) {
      this.errorMessage = `<p class="warning">Invalid email format!</p>`;
      this.invalidInput.email = true;

      setTimeout(() => {
        this.invalidInput.email = false;
        this.errorMessage = '';
      }, 3000);

      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(this.user.password, salt);

    const newUser = new User(
      this.user.name,
      this.user.email,
      passwordHash
    )

    this.service.createUser(newUser).subscribe(response => {
      alert('User registered successfully!');
      this.router.navigate(['/index']);
    })
  }
 }
