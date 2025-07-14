export interface MapDTO {
  id: string;
  huntId: string;
  name: string;
  skin: string;
  centralPointLatitude: number; // [-180, 180]
  centralPointLongitude: number; // [-90, 90]
  cmRadius: number; // ≥ 0
  digMap: boolean;
  initialMap: boolean;
}
