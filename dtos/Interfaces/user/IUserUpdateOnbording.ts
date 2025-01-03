
import { IPet } from "../pet/IPet";

export interface IUserUpdateOnbording {
  id: string;
  name?: string | null;
  birthDate?: Date | null;
  systemLanguage?: number | null;
  thumbnailUrl?: string | null;
  userLanguages?: number[] | null;
  petProfiles?: IPet[] | null;
}