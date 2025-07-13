import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import mapboxgl from 'mapbox-gl';
import { CommonModule, NgIf } from '@angular/common';
import { AnimationOverlay } from './animation-overlay/animation-overlay.component';
import { RoutePaths } from '../../../config/route-paths';
import { environment } from '../../../environment/environment';
import { LoaderComponent } from '../loader/loader.component';

interface Style {
  name: string;
  url: string;
  displayName: string;
}

@Component({
  selector: 'app-map',
  imports: [FormsModule, NgIf, AnimationOverlay, LoaderComponent, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  protected readonly RoutePaths = RoutePaths;
  public MAPBOX_ACCESS_TOKEN =
    environment.mapboxAccessToken ||
    'pk.eyJ1IjoibW1vcmdhdHNkdiIsImEiOiJjbWI3bjVtZ3cwYXNuMmxzNnY0bWpiMHU5In0.vnwcBCFV0_FxercRsaVqUg';

  public hasMapLoaded = false;
  public hasMapError = false;

  public userLattitude: number | null = null;
  public userLongitude: number | null = null;

  public defineDigZoneMode = false;

  public isDigging = false;
  public digMode = false;
  public buryMode = false;
  public isBurying = false;
  public foundSomething = false;
  public warningMessage = '';
  public needsAnimation = false;
  public animationFoundSomething = false;
  public animationChestContent?: string;

  public styles: Style[] = [
    {
      name: 'streets',
      url: 'mapbox://styles/mapbox/streets-v11',
      displayName: 'Streets',
    },
    {
      name: 'outdoors',
      url: 'mapbox://styles/mapbox/outdoors-v11',
      displayName: 'Outdoors',
    },
    {
      name: 'light',
      url: 'mapbox://styles/mapbox/light-v10',
      displayName: 'Light',
    },
    {
      name: 'dark',
      url: 'mapbox://styles/mapbox/dark-v10',
      displayName: 'Dark',
    },
    {
      name: 'satellite',
      url: 'mapbox://styles/mapbox/satellite-v9',
      displayName: 'Satellite',
    },
    {
      name: 'north-star',
      url: 'mapbox://styles/mmorgatsdv/cmb7wf0r000q201scaz19cfis',
      displayName: 'North Star',
    },
    {
      name: 'treasure-map',
      url: 'mapbox://styles/mmorgatsdv/cmb7wm8ut00r301s62p0g0v0f',
      displayName: 'Treasure Map',
    },
    {
      name: 'standard',
      url: 'mapbox://styles/mmorgatsdv/cmb7wmud200r401s65i760kva',
      displayName: 'Standard',
    },
  ];

  public digZones: Array<{ center: [number, number]; radius: number }> = [];
  public buriedTreasures: Array<{ center: [number, number]; radius: number }> =
    [];

  public currentStyle = this.styles[0];
  public map: mapboxgl.Map | null = null;
  private currentPopup: mapboxgl.Popup | null = null;

  public eiffelTowerCenter: [number, number] = [2.2945, 48.8584];
  public eiffelTowerRadius = 100;

  constructor(private readonly router: Router) {}

  static isPointInRadius(
    point: [number, number],
    center: [number, number],
    radius: number,
  ): boolean {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const [lng1, lat1] = point;
    const [lng2, lat2] = center;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const d = 2 * R * Math.asin(Math.sqrt(a));
    return d <= radius;
  }

  getUserCoordinates(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.userLattitude = pos.coords.latitude;
            this.userLongitude = pos.coords.longitude;
            resolve([pos.coords.longitude, pos.coords.latitude]);
          },
          (err) => reject(err),
        );
      } else {
        reject('Geolocation not supported');
      }
    });
  }

  toggleDigMode(): void {
    this.digMode = !this.digMode;
    if (this.digMode) {
      this.buryMode = false;
      this.warningMessage = '';
      this.map?.dragPan.disable();
      this.map
        ?.getCanvas()
        .style.setProperty(
          'cursor',
          "url('/cursors/truelle-icon.cur') 0 16, auto",
          'important',
        );
    } else {
      this.map?.dragPan.enable();
      if (this.map && this.map.getCanvas()) {
        this.map.getCanvas().style.cursor = '';
      }
    }
  }

  toggleBuryMode(): void {
    this.buryMode = !this.buryMode;
    if (this.buryMode) {
      this.digMode = false;
      this.warningMessage = '';
      this.map?.dragPan.disable();
      this.map
        ?.getCanvas()
        .style.setProperty(
          'cursor',
          "url('/cursors/chest-icon.cur') 12 12, auto",
          'important',
        );
    } else {
      this.map?.dragPan.enable();
      if (this.map && this.map.getCanvas()) {
        this.map.getCanvas().style.cursor = '';
      }
    }
  }

  createGeoJSONCircle(
    center: [number, number],
    radiusInMeters: number,
    points = 64,
  ): GeoJSON.Feature<GeoJSON.Polygon> {
    const coords = { latitude: center[1], longitude: center[0] };
    const km = radiusInMeters / 1000;
    const ret = [];
    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const offsetX = km * Math.cos((angle * Math.PI) / 180);
      const offsetY = km * Math.sin((angle * Math.PI) / 180);
      const earth = 6371;
      const lat = coords.latitude + (offsetY / earth) * (180 / Math.PI);
      const lng =
        coords.longitude +
        ((offsetX / earth) * (180 / Math.PI)) /
          Math.cos((coords.latitude * Math.PI) / 180);
      ret.push([lng, lat]);
    }
    ret.push(ret[0]);
    return {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [ret] },
      properties: {},
    };
  }

  private clearLayerAndSource(sourceId: string, layerId: string) {
    if (this.map?.getLayer(layerId)) this.map.removeLayer(layerId);
    if (this.map?.getSource(sourceId)) this.map.removeSource(sourceId);
  }

  handleMapClick = (event: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = event.lngLat;

    if (this.defineDigZoneMode) {
      if (this.digZones.length) {
        const oldZone = this.digZones[0];
        this.clearLayerAndSource(
          `dig-zone-${oldZone.center[0]}-${oldZone.center[1]}`,
          `dig-zone-layer-${oldZone.center[0]}-${oldZone.center[1]}`,
        );
        this.digZones = [];
      }
      if (this.buriedTreasures.length) {
        const oldTreasure = this.buriedTreasures[0];
        this.clearLayerAndSource(
          `treasure-${oldTreasure.center[0]}-${oldTreasure.center[1]}`,
          `treasure-layer-${oldTreasure.center[0]}-${oldTreasure.center[1]}`,
        );
        this.buriedTreasures = [];
      }

      const radius = 100;
      const circle = this.createGeoJSONCircle([lng, lat], radius);
      const sourceId = `dig-zone-${lng}-${lat}`;
      const layerId = `dig-zone-layer-${lng}-${lat}`;

      this.map?.addSource(sourceId, { type: 'geojson', data: circle });
      this.map?.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: { 'fill-color': '#ff9844', 'fill-opacity': 0.4 },
      });

      this.digZones.push({ center: [lng, lat], radius });
      this.map?.flyTo({ center: [lng, lat], zoom: 14 });

      this.defineDigZoneMode = false;
      this.warningMessage = '';
      if (this.map) this.map.getCanvas().style.cursor = '';
      return;
    }

    if (this.digMode) {
      const digZone = this.digZones[0];
      if (!digZone) {
        this.warningMessage = 'You must first define a digging zone';
        return;
      }

      const isInsideDigZone = MapComponent.isPointInRadius(
        [lng, lat],
        digZone.center,
        digZone.radius,
      );
      if (!isInsideDigZone) {
        this.warningMessage = 'You cannot dig outside of the game zone';
        return;
      }

      this.warningMessage = '';
      const treasure = this.buriedTreasures.find((t) =>
        MapComponent.isPointInRadius([lng, lat], t.center, t.radius),
      );

      const found = !!treasure;
      const content = found ? 'treasure' : undefined;

      this.triggerDigAnimation(found, content);
    } else if (this.buryMode) {
      const digZone = this.digZones[0];
      if (!digZone) {
        this.warningMessage = 'You must define a digging zone first';
        return;
      }
      const isInsideDigZone = MapComponent.isPointInRadius(
        [lng, lat],
        digZone.center,
        digZone.radius,
      );
      if (!isInsideDigZone) {
        this.warningMessage =
          'You cannot bury the treasure outside of the digging zone.';
        return;
      }
      this.warningMessage = '';

      if (this.buriedTreasures.length) {
        const oldTreasure = this.buriedTreasures[0];
        this.clearLayerAndSource(
          `treasure-${oldTreasure.center[0]}-${oldTreasure.center[1]}`,
          `treasure-layer-${oldTreasure.center[0]}-${oldTreasure.center[1]}`,
        );
        this.buriedTreasures = [];
      }

      const newRadius = 10;
      const newCircle = this.createGeoJSONCircle([lng, lat], newRadius);
      const sourceId = `treasure-${lng}-${lat}`;
      const layerId = `treasure-layer-${lng}-${lat}`;

      this.map?.addSource(sourceId, { type: 'geojson', data: newCircle });
      this.map?.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: { 'fill-color': '#ffc46c', 'fill-opacity': 0.5 },
      });

      this.buriedTreasures.push({ center: [lng, lat], radius: newRadius });
      this.isBurying = true;

      if (this.currentPopup) this.currentPopup.remove();
      this.currentPopup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat([lng, lat])
        .setHTML(
          '<img src="/assets/bury-popup.png" alt="Trésor enterré" style="width:100px; height:auto;" /><p>Trésor enterré !</p>',
        )
        .addTo(this.map!);

      setTimeout(() => (this.isBurying = false), 1500);
    }
  };

  addUserLocationMarker(mapInstance: mapboxgl.Map) {
    if (this.userLattitude !== null && this.userLongitude !== null) {
      new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([this.userLongitude, this.userLattitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML('<h3>Votre position</h3>'),
        )
        .addTo(mapInstance);
    }
  }

  ngOnInit(): void {
    mapboxgl.accessToken = this.MAPBOX_ACCESS_TOKEN;
    this.getUserCoordinates()
      .then(([lng, lat]) => {
        this.userLattitude = lat;
        this.userLongitude = lng;
      })
      .catch(() => {});

    (async () => {
      const center = this.digZones.length
        ? this.digZones[0].center
        : this.eiffelTowerCenter;
      try {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.currentStyle.url,
          center,
          zoom: 12,
        });

        this.map.on('load', () => {
          this.map?.resize();
          this.hasMapLoaded = true;
          this.map?.addControl(new mapboxgl.NavigationControl());
          if (this.map) {
            this.addUserLocationMarker(this.map);
          }

          if (this.digZones.length) {
            const zone = this.digZones[0];
            const circle = this.createGeoJSONCircle(zone.center, zone.radius);
            this.map?.addSource('dig-zone', { type: 'geojson', data: circle });
            this.map?.addLayer({
              id: 'dig-zone-layer',
              type: 'fill',
              source: 'dig-zone',
              paint: { 'fill-color': '#ff9844', 'fill-opacity': 0.4 },
            });
          }
          if (this.buriedTreasures.length) {
            const treasure = this.buriedTreasures[0];
            const circle = this.createGeoJSONCircle(
              treasure.center,
              treasure.radius,
            );
            this.map?.addSource('treasure', { type: 'geojson', data: circle });
            this.map?.addLayer({
              id: 'treasure-layer',
              type: 'fill',
              source: 'treasure',
              paint: { 'fill-color': '#ffc46cff', 'fill-opacity': 0.5 },
            });
          }

          this.map?.on('click', this.handleMapClick);
        });
      } catch {
        this.hasMapLoaded = false;
        this.hasMapError = true;
      }
    })();
  }

  activateDefineDigZoneMode(): void {
    this.defineDigZoneMode = true;
    this.digMode = false;
    this.buryMode = false;
    this.isDigging = false;
    this.isBurying = false;
    this.warningMessage = '';
    if (this.map) {
      this.map.getCanvas().style.setProperty('cursor', 'crosshair');
    }
  }

  triggerDigAnimation(found: boolean, content?: string): void {
    this.animationFoundSomething = found;
    this.animationChestContent = content;
    this.needsAnimation = true;
  }

  onDigStarted(): void {
    this.isDigging = true;
  }
  onDigEnded(): void {
    this.isDigging = false;
  }
  onCloseAnimation(): void {
    this.needsAnimation = false;
    this.animationFoundSomething = false;
    this.animationChestContent = undefined;
  }

  onStyleChange(): void {
    if (this.map && this.currentStyle) {
      this.map.setStyle(this.currentStyle.url);
      this.map.on('style.load', () => {
        this.map?.resize();
      });

      this.map.setStyle(this.currentStyle.url);
      this.map.on('style.load', () => {
        if (this.digZones.length) {
          const zone = this.digZones[0];
          const circle = this.createGeoJSONCircle(zone.center, zone.radius);
          this.map?.addSource('dig-zone', { type: 'geojson', data: circle });
          this.map?.addLayer({
            id: 'dig-zone-layer',
            type: 'fill',
            source: 'dig-zone',
            paint: { 'fill-color': '#ff9844', 'fill-opacity': 0.4 },
          });
        }
        for (const treasure of this.buriedTreasures) {
          const circle = this.createGeoJSONCircle(
            treasure.center,
            treasure.radius,
          );
          const sourceId = `treasure-${treasure.center[0]}-${treasure.center[1]}`;
          const layerId = `treasure-layer-${treasure.center[0]}-${treasure.center[1]}`;
          this.map?.addSource(sourceId, { type: 'geojson', data: circle });
          this.map?.addLayer({
            id: layerId,
            type: 'fill',
            source: sourceId,
            paint: { 'fill-color': '#ffc46cff', 'fill-opacity': 0.5 },
          });
        }
      });
    }
  }
}
