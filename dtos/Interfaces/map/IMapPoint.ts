import { MapPointType } from "@/dtos/enum/MapPointType";

export interface IMapPoint {
  id: string; // Уникальный идентификатор точки

  referenceId?: string; // Уникальный идентификатор точки в Google Maps

  name?: string; // Название точки

  description?: string; // Описание точки

  latitude?: number; // Широта точки

  longitude?: number; // Долгота точки

  type?: MapPointType; // Тип точки (Опасность, Парк и т.д.)

  createdAt?: Date; // Дата создания точки

  address?: string; // Адрес точки

  userId?: string; // Идентификатор пользователя, создавшего точку

  isEnabled?: boolean; // Включена ли точка

  isApproved?: boolean; // Одобрена ли точка

  thumbnailUrl?: string; // Ссылка на изображение точки

  note?: string; // Примечание к точке

  amenities?: string[]; // Удобства в точке
}

