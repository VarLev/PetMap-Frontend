import { IWalkAdvrtFilterParams } from "@/dtos/Interfaces/filter/IWalkAdvrtFilterParams";

export class WalkAdvrtFilterParams implements IWalkAdvrtFilterParams {
  showFullMap: boolean = false;
  distance: number;
  language?: string[];
  interests?: string[];
  gender?: string;
  age?: number;
  startTime?: number;
  endTime?: number;
  // education?: string;
  // profession?: string;
  petBreed?: string;
  petGender?: string;
  petInterests?: string[];
  activity?: number;
  temperament?: number;
  friendliness?: number;
  latitude?: number;
  longitude?: number;

  constructor(
    distance: number = 1,
    showFullMap: boolean = false,
    
    language?: string[],
    interests?: string[],
    gender?: string,
    age?: number,
    startTime?: number,
    endTime?: number,
    education?: string,
    profession?: string,
    dogBreed?: string,
    petInterests?: string[],
    activity?: number,
    temperament?: number,
    friendliness?: number,
    latitude?: number,
    longitude?: number
  ) {
    this.showFullMap = showFullMap;
    this.distance = distance;
    this.language = language;
    this.interests = interests;
    this.gender = gender;
    this.age = age;
    this.startTime = startTime;
    this.endTime = endTime;
    //this.education = education;
    //this.profession = profession;
    this.petBreed = dogBreed;
    this.petGender = dogBreed;
    //this.dogInterests = dogInterests;
    this.petInterests = petInterests;
    
    this.activity = activity;
    this.temperament = temperament;
    this.friendliness = friendliness;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
