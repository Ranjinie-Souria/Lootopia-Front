import { HuntMap } from './hunt-map.model';

export interface HuntInformationViewDTO {
  id: string;
  creatorId: string;
  creatorLogin: string;
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
  maps: HuntMap[];
}
