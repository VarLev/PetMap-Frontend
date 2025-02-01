import { DangerLevel } from "@/dtos/enum/DangerLevel";
import { DangerType } from "@/dtos/enum/DangerType";
import { IPointEntityDTO, IPointEntityShortDTO } from "./IPointEntityDTO";
import { Photo } from "@/dtos/classes/Photo";

// DTO для точки опасности, расширяет PointEntityDTO
export interface IPointDangerDTO extends IPointEntityDTO {
  id: string;   
  dangerLevel: DangerLevel;        // Уровень опасности (низкий, средний, высокий)
  dangerType: DangerType;          // Тип опасности (Дорожное движение, Змеи и т.д.)
  photos?: Photo[];
  thumbnailUrl?: string;           // Массив фотографий, связанных с точкой
  availableHours: number;          // Количество часов, в течение которых опасность актуальна
  description?: string;            // Описание точки
  userId?: string;                 // Идентификатор пользователя, создавшего точку
  latitude?: number;
  longitude?: number;
}

export interface IPointDangerShortDTO extends IPointEntityShortDTO {
  dangerType: DangerType;          // Тип опасности (Дорожное движение, Змеи и т.д.)
  latitude?: number;
  longitude?: number;
}