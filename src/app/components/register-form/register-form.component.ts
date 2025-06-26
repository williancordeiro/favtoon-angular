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
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      passwordConfirm: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const passwordControl = group.get('password');
    const passwordConfirmControl = group.get('passwordConfirm');
    const password = passwordControl ? passwordControl.value : '';
    const passwordConfirm = passwordConfirmControl ? passwordConfirmControl.value : '';
    return password === passwordConfirm ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    let { email, password, passwordConfirm, name, username } = this.form.value;
    let randomUsername = Math.floor(Math.random() * 1000000);
    username = `@${name.toLowerCase()}${randomUsername.toString().padStart(6, '0')}`
    //console.log({ email, password, passwordConfirm, name, username });

    this.service.getUserByEmail(email).then((result: any) => {
      if (result && result.items && result.items.length > 0) {
        this.errorMessage = 'Email already exists. Please use a different email.';
        return;
      }

      this.service.createUser(email, password, passwordConfirm, name, username).then(() => {
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