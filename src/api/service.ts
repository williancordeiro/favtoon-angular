import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class Service {
    private apiUrl = '/api';

    constructor(private http: HttpClient) {}

    createUser(user: any) {
        return this.http.post(`${this.apiUrl}/users`, user);
    }

    getUserById(id: string) {
        return this.http.get(`${this.apiUrl}/users/${id}`);
    }

    getUserByEmail(email: string) {
        return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`);
    }

    createSeries(series: any) {
        return this.http.post(`${this.apiUrl}/series`, series);
    }

    getSeries(id: string) {
        return this.http.get(`${this.apiUrl}/series/${id}`);
    }

    getAllSeries() {   
        return this.http.get(`${this.apiUrl}/series`);
    }
}