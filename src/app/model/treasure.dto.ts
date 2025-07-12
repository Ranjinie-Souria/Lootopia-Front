export type TreasureType = 'CROWN';

export interface TreasureDTO {
  id: string;
  huntId: string;
  quantity: number;
  treasureType: TreasureType;
  longitude: number;
  latitude: number;
}
