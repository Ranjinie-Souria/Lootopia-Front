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
import { authGuard } from './guards/auth.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { HuntsViewComponent } from './pages/hunt/hunts-view.component';
import { HuntCreateComponent } from './pages/hunt/hunt-create/hunt-create.component';
import { HuntEditComponent } from './pages/hunt/hunt-edit/hunt-edit.component';
import { LinkMapComponent } from './pages/hunt/link-map/link-map.component';
import { HuntSuccessComponent } from './pages/hunt/hunt-success/hunt-success.component';
import { SearchComponent } from './pages/search/search.component';
import { HuntInvitesComponent } from './pages/hunt/hunt-invites/hunt-invites.component';
import { HuntParticipatingComponent } from './pages/hunt/hunt-participating/hunt-participating.component';

export const routes: Routes = [
  { path: RoutePaths.DEFAULT, component: HomeComponent },
  { path: RoutePaths.HOME, component: HomeComponent, canActivate: [authGuard] },
  { path: RoutePaths.LOGIN, component: LoginComponent },
  { path: RoutePaths.RESEND_EMAIL, component: ResendEmailComponent },
  { path: RoutePaths.FORGOT_PASS, component: PasswordResetComponent },
  { path: RoutePaths.REGISTER, component: RegisterComponent },
  { path: RoutePaths.REGISTER_SUCCESS, component: RegisterSuccessComponent },
  { path: RoutePaths.VALIDATE_EMAIL, component: ValidateEmailComponent },
  { path: RoutePaths.CONTACT, component: ContactComponent },
  {
    path: RoutePaths.SEARCH,
    component: SearchComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.PROFILE,
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.HUNT,
    component: HuntsViewComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.HUNT_CREATE,
    component: HuntCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.HUNT_SUCCESS,
    component: HuntSuccessComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.HUNT_UPDATE + '/:id',
    component: HuntEditComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.LINK_MAP + '/:id',
    component: LinkMapComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.HUNT_INVITES,
    component: HuntInvitesComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.HUNT + '/:id' + '/invite',
    component: HuntInvitesComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.HUNT_PARTICIPATING,
    component: HuntParticipatingComponent,
    canActivate: [authGuard],
  },
];
