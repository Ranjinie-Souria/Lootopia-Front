import { TreasureType } from './treasure.dto';

export interface TreasureDTO {
  quantity: number;
  treasureType: TreasureType;
  longitude: number;
  latitude: number;
}
