import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../back-end/service/UserService';
import { Router } from '@angular/router';
import bcrypt from 'bcryptjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [ RouterModule, FormsModule, NgClass ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  ngOnInit() {
    const user = localStorage.getItem('user');

    if (user) {
      this.router.navigate(['/index']);
    }
  }
  
  user = {
    email: '',
    password: ''
  }

  invalidInput = {
    email: false,
    password: false
  }

  constructor(private service: UserService, private router: Router) {}

  errorMessage: string = '';

  onSubmit(form: NgForm) {
    /*if (!this.user.email || !this.user.password) {
      this.errorMessage = `<p class="warning">All fields are required!</p>`;
      return;
    }*/

    if (form.invalid) {
      this.errorMessage = `<p class="warning">All fields are required!</p>`;

      this.invalidInput = {
        email: !this.user.email,
        password: !this.user.password
      }

      setTimeout(() => {
        this.invalidInput = {
          email: false,
          password: false
        }
        this.errorMessage = '';
      }, 3000);

      return;
    }

    this.service.getUserByEmail(this.user.email).subscribe((response: any[]) => {
      const user = response[0];

      if (!user || !user.password) {
        this.errorMessage = `<p class="warning">Email or Password not valid</p>`;
        this.invalidInput = {
          email: true,
          password: true
        };

        setTimeout(() => {
          this.invalidInput = {
            email: false,
            password: false
          };
          this.errorMessage = '';
        }, 3000);
        return;
      }

      const passwordIsValid = bcrypt.compareSync(this.user.password, user.password);

      if (passwordIsValid) {
        alert('Login successful!');
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/index']);
      } else {
        this.errorMessage = `<p class="warning">Email or Password not valid</p>`;
        this.invalidInput = {
          email: true,
          password: true
        };

        setTimeout(() => {
          this.invalidInput = {
            email: false,
            password: false
          };
          this.errorMessage = '';
        }, 3000);
      }
    }, error => {
      this.errorMessage = `<p class="warning">An error occurred while trying to log in. Please try again later.</p>`;
    });
  }
}
