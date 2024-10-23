import { IPetAdvrtShortDto } from "../pet/IPetAdvrtShortDto";

export interface IWalkAdvrtShortDto {
  id?: string;
  userId?: string;
  userPhoto?:  string;
  userName?: string;
  userPets?: IPetAdvrtShortDto[];
  address?: string;
  description?: string;
  date?: Date;
  latitude?: number;
  longitude?: number;
}