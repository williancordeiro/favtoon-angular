import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Service } from '../../../api/service';
import { Router } from '@angular/router';
import bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login-form',
  imports: [ RouterModule, FormsModule ],
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

  router: Router = new Router;
  
  user = {
    email: '',
    password: ''
  };

  constructor(private service: Service) {}

  errorMessage: string = '';

  onSubmit() {
    if (!this.user.email || !this.user.password) {
      this.errorMessage = `<p class="warning">All fields are required!</p>`;
      return;
    }

    this.service.getUserByEmail(this.user.email).subscribe((response: any[]) => {
      const user = response[0];

      if (!user || !user.password) {
        this.errorMessage = `<p class="warning">Email or Password not valid</p>`;
        return;
      }

      const passwordIsValid = bcrypt.compareSync(this.user.password, user.password);

      if (passwordIsValid) {
        alert('Login successful!');
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/index']);
      } else {
        this.errorMessage = `<p class="warning">Email or Password not valid</p>`;
      }
    }, error => {
      this.errorMessage = `<p class="warning">An error occurred while trying to log in. Please try again later.</p>`;
    });
  }
}
