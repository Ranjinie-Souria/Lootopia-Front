import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UrlMapping } from '../config/api.config';
import { Router } from '@angular/router';
import { RoutePaths } from '../config/route-paths';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environment/environment';

export interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  user: { email: string; id: string; username: string };
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
  private readonly apiUrl = environment.apiUrl;

  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();
  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(
    this.getDecodedUserToken(),
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('auth_token');
    this.loggedIn.next(!!token && !this.isTokenExpired(token));
    this.startTokenExpirationCheck();
  }

  private startTokenExpirationCheck(): void {
  setInterval(() => {
    const token = localStorage.getItem('auth_token');
    if (!token || this.isTokenExpired(token)) {
      this.forceLogoutSilent();
    }
  }, 5000);
}

public forceLogoutSilent(): void {
  localStorage.removeItem('auth_token');
  this.loggedIn.next(false);
  this.currentUserSubject.next(null);
}

private isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
}


  public getDecodedUserToken(): DecodedToken | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (e) {
      return null;
    }
  }

  public getUserId(): string | null {
    const decoded = this.getDecodedUserToken();
    return decoded?.user.id || null;
  }

  public login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}` + UrlMapping.LOGIN_AUTHENTICATE,
        request,
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('auth_token', response.token);
          this.loggedIn.next(true);
          this.updateCurrentUser();
        }),
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
}
