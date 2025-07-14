import { MapDTO } from './map.dto';
import { TreasureDTO } from './treasure.dto';

export interface HuntInformationViewDTO {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorEmail: string;
  authorizedUsers: string[];
  title: string;
  description: string;
  chatEnabled: boolean;
  worldType: string;
  maxParticipants: number;
  price: number;
  excavationDelay: number;
  excavationCost: number;
  endDate: string;
  startDate: string;
  deletedDate: string;
  creationDate: string;
  isPrivate: boolean;
  maps: MapDTO[];
  treasureQuantity: number;
  treasureLatitude: number;
  treasureLongitude: number;
  type: string;
}
