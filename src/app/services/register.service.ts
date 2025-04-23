import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlMapping } from '../config/api.config';
import { environment } from '../environment/environment';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class RegisterService {

  private readonly apiUrl = environment.apiUrl + UrlMapping.REGISTER;
  private readonly http = inject(HttpClient);

  public register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  public validateEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${UrlMapping.VALIDATE_EMAIL}/${token}`, {});
  }
  
  public resendValidateEmail(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}` + UrlMapping.RESEND_VALIDATE_EMAIL,
      data,
    );
  }

}
