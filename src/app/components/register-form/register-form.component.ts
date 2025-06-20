import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../back-end/service/UserService';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { User } from '../../../../back-end/User';

@Component({
  selector: 'app-register-form',
  imports: [ ReactiveFormsModule, NgClass, CommonModule ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  providers: [UserService]
})
export class RegisterFormComponent {

  form: FormGroup;
  errorMessage: string = '';
  private fb: FormBuilder;
  private service: UserService;
  private router: Router;

  constructor(fb: FormBuilder, service: UserService, router: Router) {
    this.fb = fb;
    this.service = service;
    this.router = router;

    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');
    const password = passwordControl ? passwordControl.value : '';
    const confirmPassword = confirmPasswordControl ? confirmPasswordControl.value : '';
    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const { name, email, password, confirmPassword } = this.form.value;

    this.service.getUserByEmail(email).then((result: any) => {
      // PocketBase retorna um objeto com items (array de usuários encontrados)
      if (result && result.items && result.items.length > 0) {
        this.errorMessage = 'Email already exists. Please use a different email.';
        return;
      }

      const newUser = {
        name: name,
        email: email,
        password: password,
        passwordConfirm: confirmPassword
      }

      this.service.createUser(newUser).then(() => {
        this.router.navigate(['/login']);
      }).catch((err: any) => {
        this.errorMessage = 'An error occurred while creating the user. Please try again later.';
        console.error(err);
      });
    }).catch((error: any) => {
      this.errorMessage = 'An error occurred while checking the email. Please try again later.';
      console.error(error);
      console.log('Error during email check:', error);
    });
  }
}