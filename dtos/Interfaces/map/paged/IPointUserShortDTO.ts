import { UserPointType } from "@/dtos/enum/UserPointType";

// DTO для точки опасности, расширяет PointEntityDTO
export interface IPointUserShortDTO  {
  userPointType: UserPointType;        // Уровень опасности (низкий, средний, высокий)
  thumbnailUrl?: string;           // Массив фотографий, связанных с точкой
  description?: string;            // Описание точки
  name?: string;                   // Название точки
  address?: string;                // Адрес точки
  userId?: string;                 // Идентификатор пользователя, создавшего точку
}