import { TreasureDTO } from './treasure.dto';

export interface HuntUpdateDTO {
  title: string;
  description: string;
  chatEnabled: boolean;
  worldType: 'CARTOGRAPHIC' | 'REAL_WORLD';
  maxParticipants: number;
  price: number;
  excavationDelay: number;
  excavationCost: number;
  endDate: string;
  startDate: string;
  isPrivate: boolean;
  treasure: TreasureDTO;
  invitedPlayers: string[];
}
