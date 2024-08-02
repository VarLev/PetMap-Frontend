import { IPet } from '@/dtos/Interfaces/pet/IPet';
import { Photo } from '../Photo';

export class Pet implements IPet {
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
  photos?: Photo[] | null;
  thumbnailUrl?: string | null;

  constructor(data: Partial<IPet> = {}) {
    this.id = data.id!;
    this.petName = data.petName || '';
    this.animalType = data.animalType;
    this.breed = data.breed || '';
    this.birthDate = data.birthDate ? new Date(data.birthDate) : null;
    this.gender = data.gender || 'N/A';
    this.weight = data.weight || null;
    this.color = data.color || '';
    this.size = data.size || '';
    this.vaccinations = data.vaccinations || [];
    this.neutered = data.neutered || null;
    this.temperament = data.temperament || '';
    this.activityLevel = data.activityLevel || '';
    this.playPreferences = data.playPreferences || '';
    this.additionalNotes = data.additionalNotes || '';
    this.userId = data.userId!;
    this.photos = data.photos || [];
    this.thumbnailUrl = data.thumbnailUrl || '';
  }
}
