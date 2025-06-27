import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ProfileComponent implements OnInit, OnDestroy {
  user: any = {};
  avatarUrl: string | undefined;
  isEditing: boolean = false;
  editingField: string | null = null;
  profileForm: FormGroup;
  usernameValidationMessage: string = '';
  usernameValidationClass: string = '';
  private usernameCheckTimeout: any;

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
    
    // Limpar mensagens de validação ao começar a editar
    if (field === 'username') {
      this.usernameValidationMessage = '';
      this.usernameValidationClass = '';
    }
  }

  async saveEdit() {
    if (this.editingField) {
      let value = this.profileForm.get(this.editingField)?.value;

      // Se estiver editando o username, garante que começa com "@"
      if (this.editingField === 'username') {
        if (value && !value.startsWith('@')) {
          value = '@' + value;
          this.profileForm.get('username')?.setValue(value, { emitEvent: false });
        }

        // Verificar se o username já existe
        const isAvailable = await this.userService.checkUsernameAvailability(value, this.user.id);
        
        if (!isAvailable) {
          this.usernameValidationMessage = 'This username is already taken';
          this.usernameValidationClass = 'error';
          return; // Não prosseguir com a atualização
        } else {
          this.usernameValidationMessage = 'Username is available';
          this.usernameValidationClass = 'success';
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
          
          // Limpar mensagens de validação após sucesso
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
      // Restaurar o valor original do campo
      this.profileForm.get(this.editingField)?.setValue(this.user[this.editingField]);
      // Desabilitar o campo
      this.profileForm.get(this.editingField)?.disable();
      // Resetar o estado de edição
      this.isEditing = false;
      this.editingField = null;
      
      // Limpar mensagens de validação
      this.usernameValidationMessage = '';
      this.usernameValidationClass = '';
    }
  }

  onUsernameInput(event: Event) {
    if (this.editingField === 'username') {
      const target = event.target as HTMLInputElement;
      
      // Limpar timeout anterior
      if (this.usernameCheckTimeout) {
        clearTimeout(this.usernameCheckTimeout);
      }
      
      // Definir novo timeout para evitar muitas consultas
      this.usernameCheckTimeout = setTimeout(() => {
        this.checkUsernameAvailability(target.value);
      }, 500); // Aguarda 500ms após o usuário parar de digitar
    }
  }

  async checkUsernameAvailability(username: string) {
    if (!username) {
      this.usernameValidationMessage = '';
      this.usernameValidationClass = '';
      return;
    }

    // Adicionar @ se não tiver
    let formattedUsername = username;
    if (!formattedUsername.startsWith('@')) {
      formattedUsername = '@' + formattedUsername;
    }

    // Se o username é igual ao atual do usuário, não mostra validação
    if (formattedUsername === this.user.username) {
      this.usernameValidationMessage = '';
      this.usernameValidationClass = '';
      return;
    }

    try {
      const isAvailable = await this.userService.checkUsernameAvailability(formattedUsername, this.user.id);
      
      if (!isAvailable) {
        this.usernameValidationMessage = 'This username is already taken';
        this.usernameValidationClass = 'error';
      } else {
        this.usernameValidationMessage = 'Username is available';
        this.usernameValidationClass = 'success';
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      this.usernameValidationMessage = 'Error checking username availability';
      this.usernameValidationClass = 'error';
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

  ngOnDestroy() {
    if (this.usernameCheckTimeout) {
      clearTimeout(this.usernameCheckTimeout);
    }
  }
}
