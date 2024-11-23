import { MapPointType } from "@/dtos/enum/MapPointType";

export interface IMapPointTagDTO {
  city: string; // Город
  userId: string; // Уникальный идентификатор точки
  type: MapPointType; // Тип точки (Опасность, Парк и т.д.)
}