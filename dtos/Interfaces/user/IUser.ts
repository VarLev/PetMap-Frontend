import { IPhoto } from "../IPhoto";
import { IPet } from "../pet/IPet";

export interface IUser {
  id: string;
  firebaseUid: string;
  name?: string | null;
  email: string;
  birthDate: Date | null;
  gender?: string | null;
  description?: string | null;
  interests: string[];
  work?: string | null;
  education?: string | null;
  passwordHash?: string | null;
  fmcToken?: string | null;
  provider?: string | null;
  isEmailVerified?: boolean | null;
  isPremium?: boolean | null;
  systemLanguage?: string | null;
  dateCreated?: Date | null;
  dateUpdated?: Date | null;
  thumbnailUrl?: string | null;
  userLanguages?: string[] | null;
  photos?: IPhoto[] | null;
  petProfiles?: IPet[] | null;
  balance?: number | null;
  location?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}
