import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const RoutePaths = {
    HOME: 'home',
    ABOUT: 'about',
    CONTACT: 'contact'

  };
  

export const routes: Routes = [
    { path: '', component: AppComponent },
];
