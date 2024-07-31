
import { IPet } from "../pet/IPet";

export interface IUserUpdateOnbording {
  id: string;
  name?: string | null;
  birthDate?: Date | null;
  systemLanguage?: string | null;
  thumbnailUrl?: string | null;
  userLanguages?: string[] | null;
  petProfiles?: IPet[] | null;
}