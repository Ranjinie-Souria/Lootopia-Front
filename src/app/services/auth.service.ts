import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiConfig, UrlMapping } from '../config/api.config';
import { Router } from '@angular/router';
import { RoutePaths } from '../config/route-paths';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = ApiConfig.API_DEV;

  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor() {
    const token = localStorage.getItem('auth_token');
    this.loggedIn.next(!!token);
  }
  

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  } 

  public register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}` + UrlMapping.REGISTER, data);
  }

  public login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}` + UrlMapping.LOGIN_AUTHENTICATE, request)
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          this.loggedIn.next(true);
        })
      );
  }

  public logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn.next(false);
    this.router.navigate([RoutePaths.LOGIN]);
  }

  public checkLoginStatus(): void {
    const isAuth = !!localStorage.getItem('auth_token');
    this.loggedIn.next(isAuth);
  }
  
  
  public validateEmail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}` + UrlMapping.REGISTER, data);
  }

  public resendValidateEmail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}` + UrlMapping.RESEND_VALIDATE_EMAIL, data);
  }
  
  public validateEmailFront(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}` + UrlMapping.VALIDATE_EMAIL_FRONT_URL, data);
  }

}
