import { AmenitiesType } from "@/dtos/enum/AmenitiesType";
import { MapPointType } from "@/dtos/enum/MapPointType";
import { IMapPoint } from "@/dtos/Interfaces/map/IMapPoint";

export class MapPointDTO implements IMapPoint {
  id: string; // Уникальный идентификатор точки
  referenceId?: string; // Уникальный идентификатор точки в Google Maps
  name?: string; // Название точки
  description?: string; // Описание точки
  latitude?: number; // Широта точки
  longitude?: number; // Долгота точки
  type?: MapPointType; // Тип точки
  createdAt?: Date; // Дата создания точки
  address?: string; // Адрес точки
  userId?: string; // Идентификатор пользователя, создавшего точку
  isEnabled?: boolean; // Включена ли точка
  isApproved?: boolean; // Одобрена ли точка
  thumbnailUrl?: string; // Ссылка на изображение точки
  note?: string; // Примечание к точке
  amenities?: AmenitiesType[] | undefined;
  

  constructor(
      id: string,
      referenceId?: string,
      name?: string,
      description?: string,
      latitude?: number,
      longitude?: number,
      type?: MapPointType,
      createdAt: Date = new Date(),
      address?: string,
      userId?: string,
      isEnabled?: boolean,
      isApproved?: boolean,
      thumbnailUrl?: string,
      note?: string,
      amenities?: AmenitiesType[]
  ) {
      this.id = id;
      this.referenceId = referenceId;
      this.name = name;
      this.description = description;
      this.latitude = latitude;
      this.longitude = longitude;
      this.type = type;
      this.createdAt = createdAt;
      this.address = address;
      this.userId = userId;
      this.isEnabled = isEnabled;
      this.isApproved = isApproved;
      this.thumbnailUrl = thumbnailUrl;
      this.note = note;
      this.amenities = amenities;
  }
}