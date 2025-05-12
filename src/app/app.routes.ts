import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { IndexComponent } from './pages/index/index.component';
import { Index11Component } from './atividade11/index11/index11.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: IndexComponent },
    { path: 'act11', component: Index11Component }
];
