import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { IndexComponent } from './pages/index/index.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddSerieComponent } from './pages/add-serie/add-serie.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'index',
        component: IndexComponent, 
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'profile', component: ProfileComponent }
        ]
    },
    { path: 'add', component: AddSerieComponent }
];
