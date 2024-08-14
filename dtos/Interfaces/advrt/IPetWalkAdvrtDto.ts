export interface IPetWalkAdvrtDto {
  id: string;
  petName: string;
  breed?: string | null;
  birthDate: Date | null;
  gender?: string | null;
  temperament?: string | null;
  activityLevel?: string | null;
  thumbnailUrl?: string | null;
}