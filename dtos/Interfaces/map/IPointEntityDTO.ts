import { MapPointStatus } from "@/dtos/enum/MapPointStatus";
import { MapPointType } from "@/dtos/enum/MapPointType";

// DTO для базовой точки на карте
export interface IPointEntityDTO {
  id: string;                     // Идентификатор точки
  mapPointType: MapPointType;              // Тип точки (Danger, Park и т.д.)
  status: MapPointStatus;          // Статус точки (InMap, Pending и т.д.)
  latitude: number;                // Широта
  longitude: number;               // Долгота
  createdAt: string;               // Дата создания точки в формате ISO
}