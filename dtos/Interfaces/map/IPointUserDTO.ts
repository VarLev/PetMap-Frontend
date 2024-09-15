import { IPointEntityDTO } from "./IPointEntityDTO";
import { Photo } from "@/dtos/classes/Photo";
import { UserPointType } from "@/dtos/enum/UserPointType";
import { AmenitiesType } from "@/dtos/enum/AmenitiesType";

// DTO для точки опасности, расширяет PointEntityDTO
export interface IPointUserDTO extends IPointEntityDTO {
  UserPointType: UserPointType;        // Уровень опасности (низкий, средний, высокий)
  photos?: Photo[];
  thumbnailUrl?: string;           // Массив фотографий, связанных с точкой
  description?: string;            // Описание точки
  name?: string;                   // Название точки
  address?: string;                // Адрес точки
  userId?: string;                 // Идентификатор пользователя, создавшего точку
  amenities?: AmenitiesType[];            // Удобства
}