import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { IndexComponent } from './pages/index/index.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddSerieComponent } from './pages/add-serie/add-serie.component';
import { SerieComponent } from './pages/serie/serie.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { 
        path: 'index',
        component: IndexComponent, 
        canActivate: [AuthGuard],
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'profile', component: ProfileComponent }
        ]
    },
    { path: 'add', component: AddSerieComponent, canActivate: [AuthGuard] },
    { path: 'serie/:slug', component: SerieComponent, canActivate: [AuthGuard] },
    { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard] }
];
