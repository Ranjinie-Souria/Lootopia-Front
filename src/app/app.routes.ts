import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';  
import { RoutePaths } from './shared/route-paths';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: RoutePaths.HOME, component: HomeComponent },
    { path: RoutePaths.LOGIN, component: LoginComponent },
];
