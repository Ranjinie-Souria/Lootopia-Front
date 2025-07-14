import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UrlMapping } from '../config/api.config';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { MapCreateDTO } from '../model/map-create.dto';
import { MapUpdateDTO } from '../model/map-update.dto';
import { MapDTO } from '../model/map.dto';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly api = environment.apiUrl + UrlMapping.MAP;
  private readonly http = inject(HttpClient);

  constructor() {}

  createMap(dto: MapCreateDTO): Observable<MapDTO> {
    return this.http.post<MapDTO>(this.api, dto);
  }

  getMapById(mapId: string): Observable<MapDTO> {
    return this.http.get<MapDTO>(`${this.api}/${mapId}`);
  }

  updateMap(mapId: string, dto: MapUpdateDTO): Observable<MapDTO> {
    return this.http.put<MapDTO>(`${this.api}/${mapId}`, dto);
  }

  deleteMap(mapId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${mapId}`);
  }
}
