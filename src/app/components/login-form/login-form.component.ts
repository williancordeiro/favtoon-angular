import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../back-end/service/UserService';
import bcrypt from 'bcryptjs';
import { CommonModule, NgClass } from '@angular/common';
import { pb } from '../../../../back-end/service/PocketBaseService';

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
    if (pb.authStore.isValid) {
      this.router.navigate(['/index/home']);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    const { email, password } = this.form.value;

    this.service.login(email, password).then(() => {
      if (pb.authStore.isValid)
          this.router.navigate(['/index/home']);
      else
          this.errorMessage = 'Login failed. Please check your credentials.';
    }).catch((error: any) => {
      console.error('Login error:', error);
      this.errorMessage = 'Login failed. Please check your credentials.';
    });
  }
}