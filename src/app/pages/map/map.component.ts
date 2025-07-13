import { Component, OnInit } from '@angular/core';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { RoutePaths } from '../../config/route-paths';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../environment/environment';
import { NgIf } from '@angular/common';
import { AnimationOverlay } from './animation-overlay/animation-overlay.component';

interface Style {
  name: string;
  url: string;
  displayName: string;
}

@Component({
  selector: 'app-map',
  imports: [BtnComponent, FormsModule, NgIf, AnimationOverlay],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  protected readonly RoutePaths = RoutePaths;
  public MAPBOX_ACCESS_TOKEN =
    environment.mapboxAccessToken ||
    'pk.eyJ1IjoibW1vcmdhdHNkdiIsImEiOiJjbWI3bjVtZ3cwYXNuMmxzNnY0bWpiMHU5In0.vnwcBCFV0_FxercRsaVqUg';
  public mapContainer: HTMLElement | null = null;
  public hasMapLoaded: boolean = false; // State to track if the map has loaded
  public hasMapError: boolean = false; // State to track if there was an error loading the map
  public userLattitude: number | null = null;
  public userLongitude: number | null = null;

  public isDigging: boolean = false; // State to track if the digging animation is active
  public digMode: boolean = false; // State to track if "dig mode" is enabled
  public buryMode: boolean = false; // State to track if "burrow mode" is enabled
  public isBurying: boolean = false; // State to track if the burrowing animation is active
  public foundSomething: boolean = false; // State to track if something was found during digging
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

  public currentStyle = this.styles[0]; // Default to the first style

  // Store all radiuses as objects: { center: [lng, lat], radius: number }
  public radiuses: Array<{ center: [number, number]; radius: number }> = [
    { center: [2.2945, 48.8584], radius: 100 }, // Eiffel Tower
  ];

  public markers: mapboxgl.Marker[] = [];

  // Reference to the map instance (will be set after map initialization)
  public map: mapboxgl.Map | null = null;

  // For testing purposes, we can use the Eiffel Tower coordinates
  public eiffelTowerCenter: [number, number] = [2.2945, 48.8584];
  public eiffelTowerRadius = 100;
  public eiffelTowerCircle = this.createGeoJSONCircle(
    this.eiffelTowerCenter,
    this.eiffelTowerRadius,
  );

  constructor(private readonly router: Router) {}

  protected navigateToMap(): void {
    this.router.navigate([RoutePaths.MAP]);
  }

  public getUserCoordinates(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.userLattitude = latitude;
            this.userLongitude = longitude;
            resolve([longitude, latitude]);
          },
          (error) => {
            console.error('Error getting user location:', error);
            reject(new Error(error.message || String(error)));
          },
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  // Helper to check if a point is inside a given radius (in meters)
  static isPointInRadius(
    point: [number, number],
    center: [number, number],
    radius: number,
  ): boolean {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const [lng1, lat1] = point;
    const [lng2, lat2] = center;
    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const d = 2 * R * Math.asin(Math.sqrt(a));
    return d <= radius;
  }

  public toggleDigMode(): void {
    this.digMode = !this.digMode;
    this.buryMode = false; // Disable bury mode when toggling dig mode
    this.isBurying = false; // Disable bury mode when toggling dig mode
    console.log(`Dig mode is now ${this.digMode ? 'enabled' : 'disabled'}`);

    if (this.map) {
      if (this.digMode) {
        this.map.dragPan.disable();
        this.map
          .getCanvas()
          .style.setProperty(
            'cursor',
            "url('cursors/truelle-icon.cur') 0 16, auto",
            'important',
          );
      } else {
        this.map.dragPan.enable();
        this.map.getCanvas().style.cursor = '';
      }
    } else {
      console.warn('Map is not initialized yet.');
    }
  }

  public toggleBuryMode = () => {
    this.buryMode = !this.buryMode;
    this.digMode = false; // Disable dig mode when toggling bury mode
    this.isDigging = false; // Disable dig mode when toggling bury mode
    console.log(`Bury mode is now ${this.buryMode ? 'enabled' : 'disabled'}`);

    if (this.map) {
      if (this.buryMode) {
        this.map.dragPan.disable();
        this.map
          .getCanvas()
          .style.setProperty(
            'cursor',
            "url('cursors/chest-icon.cur') 12 12, auto",
            'important',
          );
      } else {
        this.map.dragPan.enable();
        this.map.getCanvas().style.cursor = '';
      }
    } else {
      console.warn('Map is not initialized yet.');
    }
  };

  // Add a function to create a GeoJSON circle
  public createGeoJSONCircle(
    center: [number, number],
    radiusInMeters: number,
    points = 64,
  ): GeoJSON.Feature<GeoJSON.Polygon> {
    const coords = {
      latitude: center[1],
      longitude: center[0],
    };
    const km = radiusInMeters / 1000;
    const ret = [];
    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const offsetX = km * Math.cos((angle * Math.PI) / 180);
      const offsetY = km * Math.sin((angle * Math.PI) / 180);

      // Earth’s radius, sphere
      const earth = 6371;
      // Offset coordinates in radians
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
      geometry: {
        type: 'Polygon',
        coordinates: [ret],
      },
      properties: {},
    };
  }

  public handleMapClick = (event: mapboxgl.MapMouseEvent) => {
    if (this.digMode) {
      const { lng, lat } = event.lngLat;
      const isInsideAny = this.radiuses.some((r) =>
        MapComponent.isPointInRadius([lng, lat], r.center, r.radius),
      );
      if (isInsideAny) {
        console.log(
          `Clicked point is within the defined radius around the Eiffel Tower: ${lng}, ${lat}`,
        );
        this.isDigging = true;
        this.foundSomething = true;
      } else {
        console.log('Clicked point is outside the defined radius.');
        this.isDigging = true;
        this.foundSomething = false;
      }
    } else if (this.buryMode) {
      const { lng, lat } = event.lngLat;
      // Create a new radius for the clicked point
      const newRadius = 100; // Example radius in meters
      const newCircle = this.createGeoJSONCircle([lng, lat], newRadius);
      this.radiuses.push({
        center: [lng, lat],
        radius: newRadius,
      });
      this.map?.addSource(`circle-${lng}-${lat}`, {
        type: 'geojson',
        data: newCircle,
      });
      this.map?.addLayer({
        id: `circle-layer-${lng}-${lat}`,
        type: 'fill',
        source: `circle-${lng}-${lat}`,
        layout: {},
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.5,
        },
      });
      this.isBurying = true;
      console.log(
        `Bury mode: Created a new circle at ${lng}, ${lat} with radius ${newRadius} meters.`,
      );
    }
  };

  public addUserLocationMarker(mapInstance: mapboxgl.Map) {
    if (this.userLattitude !== null && this.userLongitude !== null) {
      new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([this.userLongitude, this.userLattitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML('<h3>Your Location</h3>'),
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
        console.log(`User coordinates: ${lat}, ${lng}`);
      })
      .catch((error) => {
        console.error('Error getting user coordinates:', error);
      });

    // Use an inner async function to handle await
    (async () => {
      const [lng, lat] = await this.getUserCoordinates().catch(() => [
        2.3522, 48.8566,
      ]);

      try {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.currentStyle.url,
          center: [lng, lat],
          zoom: 12,
        });

        console.log('Mapbox map initialized:', this.map);

        this.map.on('load', () => {
          if (!this.map) {
            console.error('Map instance is not initialized.');
            this.hasMapLoaded = false;
            this.hasMapError = true;
            return;
          }
          this.hasMapLoaded = true;
          this.map.addControl(new mapboxgl.NavigationControl());
          this.addUserLocationMarker(this.map as mapboxgl.Map);

          // Add a marker and circle for the Eiffel Tower
          const eiffelTowerMarker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([2.2945, 48.8584])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                '<h3>Eiffel Tower</h3><p>Paris, France</p>',
              ),
            )
            .addTo(this.map as mapboxgl.Map);

          this.markers.push(eiffelTowerMarker);

          this.radiuses.push({
            center: this.eiffelTowerCenter,
            radius: this.eiffelTowerRadius,
          });

          this.map.addSource('eiffel-tower-circle', {
            type: 'geojson',
            data: this.eiffelTowerCircle,
          });

          this.map.addLayer({
            id: 'eiffel-tower-circle-layer',
            type: 'fill',
            source: 'eiffel-tower-circle',
            layout: {},
            paint: {
              'fill-color': '#888888',
              'fill-opacity': 0.5,
            },
          });

          // Pop up from marker that is shown right away
          //popUpFromMarker(eiffelTowerMarker, map.value as mapboxgl.Map);

          // Add click event listener to the map
          this.map.on('click', this.handleMapClick);
        });
      } catch (error) {
        console.error('Error initializing Mapbox map:', error);
        this.hasMapLoaded = false;
        this.hasMapError = true;
      }
    })();
  }
}

/* if (!MAPBOX_ACCESS_TOKEN) {
  console.error(
    'Mapbox access token is not set. Please set VITE_MAPBOX_ACCESS_TOKEN in your .env file.',
  );
} */

// If a popup is already attached to a marker, this function will show it
/* function popUpFromMarker(marker: mapboxgl.Marker, map: mapboxgl.Map) {
  const popup = marker.getPopup();
  if (popup) {
    popup.addTo(map);
  }
} */
