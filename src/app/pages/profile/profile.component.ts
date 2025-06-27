import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { UserService } from '../../../../back-end/service/UserService';
import { CommonModule, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { pb } from '../../../../back-end/service/PocketBaseService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [UserService]
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: any = {};
  avatarUrl: string | undefined;
  isEditing: boolean = false;
  editingField: string | null = null;
  profileForm: FormGroup;
  usernameValidationMessage: string = '';
  usernameValidationClass: string = '';
  private usernameCheckTimeout: any;
  isCheckingUsername: boolean = false;
  lastCheckedUsername: string | undefined;
  router: Router;

  constructor(private userService: UserService, private fb: FormBuilder, router: Router) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }]
    });

    this.router = router;
  }

  ngOnInit() {
    this.userService.getCurrentUser().then((user: any) => {
      this.user = user;
      this.avatarUrl = this.userService.getUserIcon(user);
      this.profileForm.patchValue({
        name: user.name,
        username: user.username
      });
    });
  }

  logout() {
    try {
      this.userService.logout();
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  }

  startEdit(field: string) {
    this.isEditing = true;
    this.editingField = field;
    this.profileForm.get(field)?.enable();

    if (field === 'username') {
      this.usernameValidationMessage = '';
      this.usernameValidationClass = '';
    }
  }

  async saveEdit() {
    if (this.editingField) {
      let value = this.profileForm.get(this.editingField)?.value;

      if (this.editingField === 'username') {
        if (value) {
          value = value.toLowerCase();
          if (!value.startsWith('@')) {
            value = '@' + value;
          }
          this.profileForm.get('username')?.setValue(value, { emitEvent: false });
        }

        await this.checkUsername(value);
        if (this.usernameValidationClass === 'error') {
          return;
        }
      }

      this.userService.updateUser(this.user.id, { [this.editingField]: value })
        .then((updated: any) => {
          this.user = updated;
          this.profileForm.patchValue({
            name: updated.name,
            username: updated.username
          });
          this.profileForm.get(this.editingField!)?.disable();
          this.isEditing = false;
          const currentField = this.editingField;
          this.editingField = null;
          
          if (currentField === 'username') {
            this.usernameValidationMessage = '';
            this.usernameValidationClass = '';
          }
        })
        .catch((error: any) => {
          console.error('Error updating user:', error);
          if (this.editingField === 'username') {
            this.usernameValidationMessage = 'Error updating username';
            this.usernameValidationClass = 'error';
          }
        });
    }
  }

  cancelEdit() {
    if (this.editingField) {
      this.profileForm.get(this.editingField)?.setValue(this.user[this.editingField]);
      this.profileForm.get(this.editingField)?.disable();
      this.isEditing = false;
      this.editingField = null;
      
      this.usernameValidationMessage = '';
      this.usernameValidationClass = '';
    }
  }

  onUsernameInput(event: Event) {
    if (this.editingField === 'username') {
      const target = event.target as HTMLInputElement;
      
      if (this.usernameCheckTimeout) {
        clearTimeout(this.usernameCheckTimeout);
      }

      this.usernameCheckTimeout = setTimeout(() => {
        this.checkUsername(target.value);
      }, 500);
    }
  }

  ngOnDestroy() {
    if (this.usernameCheckTimeout) {
      clearTimeout(this.usernameCheckTimeout);
    }
  }

  async checkUsername(username: string) {
    if (!username || username.length < 3) {
      this.usernameValidationMessage = 'Username must be at least 3 characters';
      this.usernameValidationClass = 'error';
      return;
    }

    username = username.trim().toLowerCase();

    if (!username.startsWith('@')) {
      username = '@' + username;
    }

    this.isCheckingUsername = true;
    this.lastCheckedUsername = username;

    try {
      const currentUserId = pb.authStore.model?.id;
      const isAvailable = await this.userService.checkUsernameAvailability(username, currentUserId);

      if (this.lastCheckedUsername !== username) return;

      this.usernameValidationMessage = isAvailable 
          ? 'Username is available' 
          : 'Username already exists';
      this.usernameValidationClass = isAvailable ? 'success' : 'error';
    } catch (error) {
      if (this.lastCheckedUsername !== username) return;

      console.error('Validation error:', error);
      this.usernameValidationMessage = 'Error during validation';
      this.usernameValidationClass = 'error';
    } finally {
      this.isCheckingUsername = false;
    }
  }

  chanchePassword() {
    this.router.navigate(['/reset-password']);
  }

}