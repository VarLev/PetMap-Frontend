export interface IPetUpdateOnbording {
    petName: string;
    breed?: string | null;
    birthDate?: Date | null;
    userId: string;
    thumbnailUrl?: string | null;
}