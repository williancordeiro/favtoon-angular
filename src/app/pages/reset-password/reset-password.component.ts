import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../../back-end/service/UserService';
import { pb } from '../../../../back-end/service/PocketBaseService';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  private userService = new UserService();

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPasswordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmPassword');
    const newPassword = newPasswordControl ? newPasswordControl.value : '';
    const confirmPassword = confirmPasswordControl ? confirmPasswordControl.value : '';
    return newPassword === confirmPassword ? null : { notMatching: true };
  }

  async changePassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.passwordForm.invalid) {
      if (this.passwordForm.get('currentPassword')?.hasError('required')) {
        this.errorMessage = 'Current password is required';
      } else if (this.passwordForm.get('newPassword')?.hasError('required')) {
        this.errorMessage = 'New password is required';
      } else if (this.passwordForm.get('newPassword')?.hasError('pattern')) {
        this.errorMessage = 'New password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number';
      } else if (this.passwordForm.get('confirmPassword')?.hasError('required')) {
        this.errorMessage = 'Password confirmation is required';
      } else if (this.passwordForm.hasError('notMatching')) {
        this.errorMessage = 'Passwords do not match';
      } else {
        this.errorMessage = 'Please fill out the form correctly';
      }
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (currentPassword === newPassword) {
      this.errorMessage = 'New password must be different from current password';
      return;
    }

    this.isLoading = true;

    try {
      await this.userService.changeUserPassword(currentPassword, newPassword, confirmPassword);
      
      const currentUser = pb.authStore.model;
      if (currentUser) {
        await pb.collection('users').authWithPassword(currentUser['email'], newPassword);
      }
      
      this.successMessage = 'Password changed successfully!';
      this.passwordForm.reset();
      
      setTimeout(() => {
        this.router.navigate(['/index/home']);
      }, 700);
      
    } catch (error: any) {
      if (error.message === 'User not authenticated') {
        this.errorMessage = 'User session expired. Please login again';
      } else if (error.status === 400) {
        const errorData = error.response?.data;
        if (errorData) {
          if (errorData.oldPassword) {
            this.errorMessage = 'Current password is incorrect';
          } else if (errorData.password) {
            this.errorMessage = 'New password does not meet requirements';
          } else if (errorData.passwordConfirm) {
            this.errorMessage = 'Password confirmation does not match';
          } else {
            this.errorMessage = 'Invalid password information provided';
          }
        } else {
          this.errorMessage = 'Current password is incorrect';
        }
      } else if (error.status === 401) {
        this.errorMessage = 'Current password is incorrect';
      } else if (error.status === 403) {
        this.errorMessage = 'You do not have permission to change this password';
      } else if (error.status === 404) {
        this.errorMessage = 'User not found';
      } else {
        this.errorMessage = 'An error occurred while changing password. Please try again';
      }
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/index/home']);
  }
}