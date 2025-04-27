import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlMapping } from '../config/api.config';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class PasswordService {

  private readonly apiUrl = environment.apiUrl + UrlMapping.PASSWORD;
  private readonly http = inject(HttpClient);


  public resetPassword(email: string): Observable<any> {
    const body = { email };
    return this.http.post(`${this.apiUrl}${UrlMapping.PASSWORD_EMAIL}`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  
  public editPassword(password: string, token: string): Observable<any> {
    const body = { password, token };
    return this.http.patch(`${this.apiUrl}`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

}
