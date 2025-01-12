export interface IPetAdvrtShortDto {
  id: string;
  petName: string;
  breed?: number | null;
  birthDate: Date | null;
  gender?: number | null;
  thumbnailUrl?: string | null;
  animalType?: number | null;
}