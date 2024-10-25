import { AmenitiesType } from "@/dtos/enum/AmenitiesType";
import { MapPointStatus } from "@/dtos/enum/MapPointStatus";
import { MapPointType } from "@/dtos/enum/MapPointType";

// DTO для базовой точки на карте
export interface IPointEntityDTO {
  id: string;                     // Идентификатор точки
  mapPointType: MapPointType;              // Тип точки (Danger, Park и т.д.)
  status?: MapPointStatus;          // Статус точки (InMap, Pending и т.д.)
  latitude?: number;                // Широта
  longitude?: number;               // Долгота
  createdAt?: string;               // Дата создания точки в формате ISO
  thumbnailUrl?: string;            // URL миниатюры точки
  description?: string;             // Описание точки
  address?: string;                 // Адрес точки
  name?: string;                    // Название точки
  amenities?: AmenitiesType[];      // Удобства точки
}

export interface IPointEntityShortDTO {
  id: string;                     // Идентификатор точки
  mapPointType: MapPointType;     // Тип точки (Danger, Park и т.д.)       
  latitude?: number;              // Широта
  longitude?: number;             // Долгота
}