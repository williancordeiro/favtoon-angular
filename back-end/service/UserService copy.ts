import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../User";

@Injectable({
  providedIn: 'root'
})

export class UserService {
    
    private apiUrl = '/api';

    constructor(private http: HttpClient) {}

    createUser(user: User) {
        return this.http.post(`${this.apiUrl}/users`, user);
    }

    getUserById(id: string) {
        return this.http.get(`${this.apiUrl}/users/${id}`);
    }

    getUserByEmail(email: string) {
        return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`);
    }
}