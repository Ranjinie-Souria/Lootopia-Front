import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlMapping } from '../config/api.config';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly api = environment.apiUrl + UrlMapping.CONTACT;
  private readonly http = inject(HttpClient);

  createContactInquiry(data: {
    email: string;
    name: string;
    subject: string;
    text: string;
    type: string;
  }): Observable<any> {
    return this.http.post(`${this.api}`, data);
  }
}
