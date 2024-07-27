export class UserDTO {
  firebaseUid: string;
  email: string;
  name: string;
  age: number | null;
  gender: string;
  userLanguages: string[];
  description: string;
  interests:string[];
  work: string;
  education: string;
  // petProfiles: PetProfileDTO[];
  // photos: PhotoDTO[];
  thumbnailUrl: string;
  fmcToken: string;

  constructor(
    firebaseUid: string = '',
    email: string = '',
    name: string = '',
    age: number | null = null,
    gender: string = '',
    description: string = '',
    userLanguages: string [] = [],
    interests:string[] = [],
    work: string = '',
    education: string = '',
    // petProfiles: PetProfileDTO[] = [],
    // photos: PhotoDTO[] = [],
    thumbnailUrl: string = '',
    fmcToken: string= ''
  ) {
    this.firebaseUid = firebaseUid || '';
    this.email = email || '';
    this.name = name || '';
    this.age = age ?? 0; // Используйте 0 или другой подходящий вам дефолтный возраст
    this.gender = gender || '';
    this.description = description || '';
    this.userLanguages = userLanguages || [];
    this.interests = interests || [];
    this.work = work || '';
    this.education = education || '';
    // this.petProfiles = petProfiles || [];
    // this.photos = photos || [];
    this.thumbnailUrl = thumbnailUrl || '';
    this.fmcToken = fmcToken || '';
  }
}