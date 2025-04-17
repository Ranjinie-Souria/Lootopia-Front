import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiConfig, UrlMapping } from '../config/api.config';
import { Router } from '@angular/router';
import { RoutePaths } from '../config/route-paths';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  user: {email: string, id: string, username: string};
}

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
  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(this.getDecodedUserToken());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor() {
    const token = localStorage.getItem('auth_token');
    this.loggedIn.next(!!token);
  }

  public getDecodedUserToken(): DecodedToken | null {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      try {
          return jwtDecode<DecodedToken>(token);
      } catch (e) {
          console.error('Invalid token:', e);
          return null;
      }
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
          this.updateCurrentUser(); 
        })
      );
  }
  
  public logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate([RoutePaths.LOGIN]);
  }
  
  public updateCurrentUser() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        this.currentUserSubject.next(decoded);
      } catch (e) {
        console.error('Invalid token:', e);
        this.currentUserSubject.next(null);
      }
    } else {
      this.currentUserSubject.next(null);
    }
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
