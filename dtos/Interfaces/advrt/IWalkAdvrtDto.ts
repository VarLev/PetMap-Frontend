import { IPetWalkAdvrtDto } from "./IPetWalkAdvrtDto";

export interface IWalkAdvrtDto {
  id?: string;
  userPhoto?:  string;
  userName?: string;
  userPets?: IPetWalkAdvrtDto[];
  petId?: string[];
  address?: string;

  participants?: string[];
  participantsPetId?: string[];

  description?: string;

  latitude?: number;

  longitude?: number;

  date?: Date;

  createdAt?: Date;

  type?: string;

  userId?: string;

  status?: string;

  isEnabled?: boolean;

  
}