import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig, UrlMapping } from '../config/api.config';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = ApiConfig.API_DEV;

  constructor(private http: HttpClient) {}

  public register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}` + UrlMapping.REGISTER, data);
  }
  public login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}` + UrlMapping.LOGIN, data);
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
