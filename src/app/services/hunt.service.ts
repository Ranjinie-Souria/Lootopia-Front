import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { UrlMapping } from '../config/api.config';
import { HuntInformationViewDTO } from '../model/hunt-information-view.dto';
import { HuntUpdateDTO } from '../model/hunt-update.dto';

@Injectable({
  providedIn: 'root',
})
export class HuntsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + UrlMapping.HUNT;

  getHunts(): Observable<HuntInformationViewDTO[]> {
    return this.http.get<HuntInformationViewDTO[]>(this.baseUrl);
  }

  getHuntById(huntId: string): Observable<HuntInformationViewDTO> {
    return this.http.get<HuntInformationViewDTO>(`${this.baseUrl}/${huntId}`);
  }

  createHunt(payload: HuntUpdateDTO): Observable<HuntInformationViewDTO> {
    return this.http.post<HuntInformationViewDTO>(this.baseUrl, payload);
  }

  updateHunt(huntId: string, payload: HuntUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${huntId}`, payload);
  }

  deleteHunt(huntId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${huntId}`);
  }

  addToWhitelist(huntId: string, playerId: string): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${huntId}/whitelist`,
      playerId,
    );
  }

  removeFromWhitelist(huntId: string, playerId: string): Observable<void> {
    return this.http.request<void>(
      'delete',
      `${this.baseUrl}/${huntId}/whitelist`,
      {
        body: playerId,
      },
    );
  }

  getMyHunts(): Observable<HuntInformationViewDTO[]> {
    return this.http.get<HuntInformationViewDTO[]>(`${this.baseUrl}/me`);
  }
}
