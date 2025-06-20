import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../back-end/service/UserService';
import bcrypt from 'bcryptjs';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgClass],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  providers: [UserService]
})
export class LoginFormComponent implements OnInit {

  form: FormGroup;
  errorMessage: string = '';
  private fb: FormBuilder;
  private service: UserService;
  private router: Router

  constructor(fb: FormBuilder, service: UserService, router: Router) {
    this.fb = fb;
    this.service = service;
    this.router = router;
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      this.router.navigate(['/index']);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    const { email, password } = this.form.value;

    this.service.login(email, password).then((autoData: any) => {
      localStorage.setItem('user', JSON.stringify(autoData.record));
      localStorage.setItem('token', autoData.token);
      this.router.navigate(['/index']);

    }).catch((error: any) => {
      this.errorMessage = 'Email or password is incorrect.';
      console.error('Login error:', error);
    });
  }
}