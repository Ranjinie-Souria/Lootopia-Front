import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';  
import { RoutePaths } from './config/route-paths';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterSuccessComponent } from './pages/register/register-success/register-success.component';
import { ValidateEmailComponent } from './pages/register/validate-email/validate-email.component';
import { HomeConnectedComponent } from './pages/home/home-connected/home-connected.component';
import { authGuard } from './guards/auth.guard';


/**
 * , canActivate: [authGuard]
 */

export const routes: Routes = [
    { path: RoutePaths.DEFAULT, component: HomeComponent },
    { path: RoutePaths.HOME, component: HomeComponent},
    { path: RoutePaths.LOGIN, component: LoginComponent },
    { path: RoutePaths.REGISTER, component: RegisterComponent },
    { path: RoutePaths.REGISTER_SUCCESS, component: RegisterSuccessComponent },
    { path: RoutePaths.VALIDATE_EMAIL, component: ValidateEmailComponent },
];
