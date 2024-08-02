import { IPhoto } from '../IPhoto';

export interface IPet {
  id: string;
  petName: string;
  animalType?: string | null;
  breed?: string | null;
  birthDate: Date | null;
  gender?: string | null;
  weight: number | null;
  color?: string | null;
  size?: string | null;
  vaccinations?: string[] | null;
  neutered: boolean | null;
  temperament?: string | null;
  activityLevel?: string | null;
  playPreferences?: string | null;
  additionalNotes?: string | null;
  userId: string;
  photos?: IPhoto[] | null;
  thumbnailUrl?: string | null;
}