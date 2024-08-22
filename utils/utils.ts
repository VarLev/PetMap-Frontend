import { avatarsStringF, avatarsStringM } from "@/constants/Avatars";
import { IUser } from "@/dtos/Interfaces/user/IUser";

/**
 * Вычисляет возраст собаки в годах или месяцах в зависимости от даты рождения.
 * @param birthDate Дата рождения собаки.
 * @returns Возраст собаки в строковом формате.
 */
export function calculateDogAge(birthDate?: Date | null): string {
  const today = new Date();
  if (!birthDate) return 'Unknown';

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();

  // Если текущий месяц меньше месяца рождения, уменьшаем год и добавляем месяцам 12
  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  if (ageYears === 0) {
    return `${ageMonths} m.`;
  } else {
    return `${ageYears} y.`;
  }
}

/**
 * Возвращает иконку пола в зависимости от переданного значения.
 * @param gender Пол (male, female или другое).
 * @returns Иконка в виде строки.
 */
export function getGenderIcon(gender: string): string {
  switch (gender.toLowerCase()) {
    case 'male':
      return 'male';
    case 'female':
      return 'female';
    default:
      return 'paw'; // Универсальная иконка, подходящая для животных
  }
}

export function setUserAvatarDependOnGender(user: IUser): string {
  const randomIndex = Math.floor(Math.random() * avatarsStringF.length);
  if(user.gender){
    if(user.gender.toLowerCase()==='female'){
      return avatarsStringF[randomIndex];
    }
    else{
      return avatarsStringM[randomIndex];
    }
  }
  else{
    return avatarsStringM[randomIndex];
  }
}