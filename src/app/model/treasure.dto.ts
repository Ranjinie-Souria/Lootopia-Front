export enum TreasureType {
  CROWN = 'CROWN',
}

export interface TreasureDTO {
  id?: string;
  huntId?: string;
  quantity: number;
  type: TreasureType;
  longitude: number;
  latitude: number;
}
