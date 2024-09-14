import { Photo } from "@/dtos/classes/Photo";
import { IPointEntityDTO } from "./IPointEntityDTO";
import { AmenitiesType } from "@/dtos/enum/AmenitiesType";

// DTO для парка (расширяет базовый PointEntityDTO)
export interface IPointParkDTO extends IPointEntityDTO {
  name?: string;                  // Название парка
  description?: string;            // Описание парка
  address?: string;                // Адрес парка
  userId?: string;                 // Идентификатор пользователя, создавшего точку
  photos?: Photo[];             // Фотографии, связанные с точкой
  amenities?: AmenitiesType[];     // Удобства, доступные в парке
}