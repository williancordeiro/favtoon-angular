import { Injectable } from '@angular/core';
import { pb } from '../../../back-end/service/PocketBaseService';
import { UserService } from '../../../back-end/service/UserService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private userService = new UserService();
  
  constructor() {}
  
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  }
  
  getCurrentUser() {
    return pb.authStore.model;
  }
  
  login(email: string, password: string) {
    return this.userService.login(email, password);
  }
  
  logout(): void {
    this.userService.logout();
  }
}
