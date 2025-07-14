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
  private readonly stripeUrl = environment.apiUrl + UrlMapping.STRIPE;

  getPacks(page: string, size: string): Observable<PageDTO<PackDto>> {
    const url = `${this.apiUrl}`;
    return this.http.get<any>(url, {
      params: {
        page,
        size,
      },
    });
  }

  goToStripeCheckout(
    productName: string,
    amount: number,
    detailedInformation: string,
    quantity: number,
  ): Observable<any> {
    const url = `${this.stripeUrl}`;
    const payload = {
      productName,
      amount,
      detailedInformation,
      quantity,
    };
    return this.http.post<any>(url, payload);
  }
}
