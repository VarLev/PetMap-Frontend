import { IUser } from '@/dtos/Interfaces/user/IUser';
import { Pet } from '../pet/Pet';
import { Photo } from '../Photo';
import { Job } from '../job/Job';

export class User implements IUser {
  id: string;
  firebaseUid: string;
  name?: string | null;
  email: string;
  birthDate: Date | null;
  gender?: number | null;
  description?: string | null;
  interests: number[] ;
  work?: number[] | null;
  education?: string | null;
  //passwordHash?: string | null;
  fmcToken?: string | null;
  provider?: string | null;
  isEmailVerified?: boolean | null;
  isPremium?: boolean | null;
  systemLanguage?: number | null;
  dateCreated?: Date | null;
  dateUpdated?: Date | null;
  thumbnailUrl?: string | null;
  userLanguages?: number[];
  photos?: Photo[] | null;
  petProfiles: Pet[] | null;
  avatarUrl: any;
  balance?: number | null ;
  facebook?: string | null ;
  instagram?: string | null ;
  location?: string | null ;
  jobs?: Job[] | null;

  

  constructor(data: Partial<IUser> = {}) {
    this.id = data.id ||'';
    this.firebaseUid = data.firebaseUid || '';
    this.name = data.name;
    this.email = data.email || '';
    this.birthDate = data.birthDate ? new Date(data.birthDate) : null;
    this.gender = data.gender;
    this.description = data.description;
    this.interests = data.interests || [];
    this.work = data.work || [];
    this.education = data.education;
    //this.passwordHash = data.passwordHash;
    this.fmcToken = data.fmcToken;
    this.provider = data.provider;
    this.isEmailVerified = data.isEmailVerified;
    this.isPremium = data.isPremium;
    this.systemLanguage = data.systemLanguage;
    this.dateCreated = data.dateCreated ? new Date(data.dateCreated) : null;
    this.dateUpdated = data.dateUpdated ? new Date(data.dateUpdated) : null;
    this.thumbnailUrl = data.thumbnailUrl;
    this.userLanguages = data.userLanguages || [];
    this.photos = data.photos || [];
    this.petProfiles = data.petProfiles ? data.petProfiles.map(p => new Pet(p)) : [];
    this.balance = data.balance || 0;
    this.facebook = data.facebook;
    this.instagram = data.instagram;
    this.location = data.location;
    this.jobs = data.jobs || [];
  }
}
