import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { UserService } from '../../../../back-end/service/UserService';
import { CommonModule, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [UserService]
})
export class ProfileComponent implements OnInit {
  user: any = {};
  avatarUrl: string | undefined;
  isEditing: boolean = false;
  editingField: string | null = null;
  profileForm: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }]
    });
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

  startEdit(field: string) {
    this.isEditing = true;
    this.editingField = field;
    this.profileForm.get(field)?.enable();
  }

  saveEdit() {
    if (this.editingField) {
      let value = this.profileForm.get(this.editingField)?.value;

      // Se estiver editando o username, garante que começa com "@"
      if (this.editingField === 'username') {
        if (value && !value.startsWith('@')) {
          value = '@' + value;
          this.profileForm.get('username')?.setValue(value, { emitEvent: false });
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
          this.editingField = null;
        });
    }
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
}
