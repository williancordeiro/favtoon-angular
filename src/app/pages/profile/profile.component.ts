import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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
  @Input() initialUser: any = null;
  @Output() userUpdated = new EventEmitter<any>();
  @Output() logoutRequested = new EventEmitter<void>();
  @Output() passwordChangeRequested = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
  isUploadingImage: boolean = false;
  imageValidationMessage: string = '';
  imageValidationClass: string = '';

  constructor(private userService: UserService, private fb: FormBuilder, router: Router) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }]
    });

    this.router = router;
  }

  ngOnInit() {
    if (this.initialUser) {
      this.user = this.initialUser;
      this.avatarUrl = this.userService.getUserIcon(this.user);
      this.profileForm.patchValue({
        name: this.user.name,
        username: this.user.username
      });
    } else {
      this.userService.getCurrentUser().then((user: any) => {
        this.user = user;
        this.avatarUrl = this.userService.getUserIcon(user);
        this.profileForm.patchValue({
          name: user.name,
          username: user.username
        });
      });
    }
  }

  logout() {
    try {
      this.userService.logout();
      this.logoutRequested.emit();
      this.router.navigate(['/login']);
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
          this.userUpdated.emit(updated);
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

  iconUpdate() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    this.imageValidationMessage = '';
    this.imageValidationClass = '';

    if (!file.type.startsWith('image/')) {
      this.imageValidationMessage = 'Please select only image files';
      this.imageValidationClass = 'error';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.imageValidationMessage = 'Image must be at most 5MB';
      this.imageValidationClass = 'error';
      return;
    }

    this.validateImageAspectRatio(file);
  }

  validateImageAspectRatio(file: File) {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width !== img.height) {
        this.imageValidationMessage = 'Image must be square (1:1). Current dimensions: ' + img.width + 'x' + img.height;
        this.imageValidationClass = 'error';
        return;
      }
      
      this.uploadImage(file);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      this.imageValidationMessage = 'Error loading image';
      this.imageValidationClass = 'error';
    };
    
    img.src = url;
  }

  async uploadImage(file: File) {
    this.isUploadingImage = true;
    this.imageValidationMessage = 'Uploading image...';
    this.imageValidationClass = 'success';

    try {
      const updatedUser = await this.userService.updateUserIcon(this.user.id, file);
      
      this.user = updatedUser;
      this.avatarUrl = this.userService.getUserIcon(updatedUser);
      
      this.userUpdated.emit(updatedUser);
      
      this.imageValidationMessage = 'Image updated successfully!';
      this.imageValidationClass = 'success';
      
      setTimeout(() => {
        this.imageValidationMessage = '';
        this.imageValidationClass = '';
      }, 3000);
      
    } catch (error: any) {
      console.error('Error updating image:', error);
      this.imageValidationMessage = 'Error updating image. Please try again.';
      this.imageValidationClass = 'error';
    } finally {
      this.isUploadingImage = false;
      this.fileInput.nativeElement.value = '';
    }
  }

  changePassword() {
    this.passwordChangeRequested.emit();
    this.router.navigate(['/reset-password']);
  }

}