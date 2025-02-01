import { IPhoto } from '@/dtos/Interfaces/IPhoto';

export class Photo implements IPhoto {
  id?: string;
  url?: string;
  isMain?: boolean;
  dateCreated?: Date;
  userId?: string;
  petProfileId?: string;

  constructor(data: any) {
    this.id = data.id;
    this.url = data.url;
    this.isMain = data.isMain;
    this.dateCreated = new Date(data.dateCreated);
    this.userId = data.userId;
    this.petProfileId = data.petProfileId;
  }
}