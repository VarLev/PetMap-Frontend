export interface IPetWalkAdvrtDto {
  id: string;
  petName: string;
  breed?: string | null;
  birthDate: Date | null;
  gender?: string | null;
  temperament?: number | null;
  activityLevel?: number | null;
  friendliness?: number | null;
  thumbnailUrl?: string | null;
}