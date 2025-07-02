export interface HuntUpdateDTO {
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
  private: boolean;
}
