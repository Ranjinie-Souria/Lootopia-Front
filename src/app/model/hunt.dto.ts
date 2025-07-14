import { TreasureDTO } from './treasure.dto';

export interface HuntDto {
  id?: string;
  creatorId: string;
  title: string;
  description: string;
  chatEnabled: boolean;
  worldType: 'CARTOGRAPHIC' | 'REAL_WORLD';
  isPrivate: boolean;
  maxParticipants: number;
  price: number;
  excavationDelay: number;
  excavationCost: number;
  endDate: string;
  startDate: string;
  creationDate: string;
  invitedPlayers: string[];
  treasure: TreasureDTO;
}
