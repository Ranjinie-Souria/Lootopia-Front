import { TreasureType } from './treasure.dto';

export interface TreasureDTO {
  quantity: number;
  type: TreasureType;
  longitude: number;
  latitude: number;
}
