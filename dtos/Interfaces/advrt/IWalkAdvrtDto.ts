import { Pet } from "@/dtos/classes/pet/Pet";
import { IUserAdvrt } from "../user/IUserAdvrt";
import { AdvrtType } from "@/dtos/enum/AdvrtType";
import { WalkAdvrtStatus } from "@/dtos/enum/WalkAdvrtStatus";

export interface IWalkAdvrtDto {
  id?: string;
  userPhoto?:  string;
  userName?: string;
  userPets?: Pet[];
  address?: string;
  participants?: IUserAdvrt[];
  description?: string;
  latitude?: number;
  longitude?: number;
  date?: Date;
  createdAt?: Date;
  type?: AdvrtType;
  userId?: string;
  status?: WalkAdvrtStatus;
  isEnabled?: boolean;
  duration?: number;
  isRegular?: boolean;
  selectedDays?: number[];
  startTime?: number;
  city?: string;
}