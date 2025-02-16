import { IPetForUserCardDto } from "../pet/IPetForUserCardDto";

export interface IUserCardDto {
  id: string;
  name?: string | null;
  interests: number[] | null;
  thumbnailUrl?: string | null;
  petProfiles?: IPetForUserCardDto[] | null;
  balance?: number | null;
  isPremium?: boolean | null;
}
