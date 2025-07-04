import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RoutePaths } from './config/route-paths';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterSuccessComponent } from './pages/register/register-success/register-success.component';
import { ValidateEmailComponent } from './pages/register/validate-email/validate-email.component';
import { PasswordResetComponent } from './pages/login/password-reset/password-reset.component';
import { ResendEmailComponent } from './pages/login/resend-email/resend-email.component';
import { ContactComponent } from './pages/contact/contact.component';

/**
 * , canActivate: [authGuard]
 */

export const routes: Routes = [
  { path: RoutePaths.DEFAULT, component: HomeComponent },
  { path: RoutePaths.HOME, component: HomeComponent },
  { path: RoutePaths.LOGIN, component: LoginComponent },
  { path: RoutePaths.RESEND_EMAIL, component: ResendEmailComponent },
  { path: RoutePaths.FORGOT_PASS, component: PasswordResetComponent },
  { path: RoutePaths.REGISTER, component: RegisterComponent },
  { path: RoutePaths.REGISTER_SUCCESS, component: RegisterSuccessComponent },
  { path: RoutePaths.VALIDATE_EMAIL, component: ValidateEmailComponent },
  { path: RoutePaths.CONTACT, component: ContactComponent },
];
