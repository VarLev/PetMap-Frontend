import { Pet } from "@/dtos/classes/pet/Pet";

export interface IWalkAdvrtDto {
  id?: string;
  userPhoto?:  string;
  userName?: string;
  userPets?: Pet[];
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