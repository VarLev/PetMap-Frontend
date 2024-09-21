export interface IPetWalkAdvrt {
  Id?: string;
  petName?: string;
  breed?: number | null;
  birthDate: Date | null;
  gender?: number | null;
  temperament?: number | null;
  activityLevel?: number | null;
  friendliness?: number | null;
  thumbnailUrl?: string;
}