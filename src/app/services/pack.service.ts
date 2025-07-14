import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { UrlMapping } from '../config/api.config';
import { PageDTO } from '../model/page.dto';
import { PackDto } from '../model/pack.dto';

@Injectable({
  providedIn: 'root',
})
export class PackService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + UrlMapping.PACKS;

  getPacks(page: string, size: string): Observable<PageDTO<PackDto>> {
    const url = `${this.apiUrl}`;
    return this.http.get<any>(url, {
      params: {
        page,
        size,
      },
    });
  }
}
