import bcrypt from "bcryptjs";

export class User {

    private id: string = '';
    private name: string = '';
    private email: string = '';
    private password: string = '';

    constructor(name: string, email: string, password: string) {
        this.setName(name);
        this.setEmail(email);
        this.setPassword(password);
    }

    public getId(): string {
        return this.id;
    }

    private setName(name: string): void {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    private setEmail(email: string): void {
        this.email = email;
    }

    public getEmail(): string {
        return this.email;
    }

    private setPassword(password: string): void {
        this.password = password;
    }
}