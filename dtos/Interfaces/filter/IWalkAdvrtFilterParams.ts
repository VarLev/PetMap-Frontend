export interface IWalkAdvrtFilterParams {
  showFullMap?: boolean;
  distance?: number;
  language?: string[];
  interests?: string[]; // Массив строк
  gender?: string;
  age?: number;
  startTime?: number;
  endTime?: number;
  //education?: string;
  //profession?: string;
  petBreed?: string;
  petGender?: string;
  petInterests?: string[]; // Массив строк
  activity?: number; // Оценка активности
  temperament?: number; // Оценка темперамента
  friendliness?: number; // Оценка дружелюбности
  latitude?: number; // Для фильтрации по дистанции
  longitude?: number; // Для фильтрации по дистанции
  city?: string; // Для фильтрации по городу
}