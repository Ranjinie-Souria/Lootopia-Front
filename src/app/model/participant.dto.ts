export interface ParticipantDto {
  id: string;
  userId: string;
  huntId: string;
  timeToResolve: number;
  status: 'PENDING' | 'DONE';
  lastDigTime: Date;
  creationDate: Date;
}
