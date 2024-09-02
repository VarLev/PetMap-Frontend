import { avatarsStringF, avatarsStringM } from "@/constants/Avatars";
import { IUser } from "@/dtos/Interfaces/user/IUser";

/**
 * Вычисляет возраст собаки в годах или месяцах в зависимости от даты рождения.
 * @param birthDate Дата рождения собаки.
 * @returns Возраст собаки в строковом формате.
 */
export function calculateDogAge(birthDate?: Date | null | undefined): string {
  if (!birthDate) return 'Unknown';

  // Если birthDate является строкой, преобразуем её в объект Date
  if (typeof birthDate === 'string') {
    birthDate = new Date(birthDate);
  }

  // Проверка, что birthDate это объект Date и он валиден
  if (birthDate instanceof Date && !isNaN(birthDate.getTime())) {
    const today = new Date();
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    if (ageYears === 0) {
      return `${ageMonths} m.`;
    } else {
      return `${ageYears} y.`;
    }
  } else {
    return 'Unknown';
  }
}

export function calculateHumanAge(birthDate?: Date | null): string {
  const today = new Date();
  if (!birthDate) return '';

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();

  // Если текущий месяц и день меньше месяца и дня рождения, уменьшаем год и корректируем месяцы
  if (ageMonths < 0 || (ageMonths === 0 && today.getDate() < birthDate.getDate())) {
    ageYears--;
    ageMonths += 12;
  }

  // Корректируем количество месяцев, если дни не совпадают
  if (today.getDate() < birthDate.getDate()) {
    ageMonths--;
  }

  if (ageYears === 0) {
    return `${ageMonths} m.`;
  } else if (ageMonths > 0) {
    return `${ageYears} y. ${ageMonths} m.`;
  } else {
    return ageYears.toString();
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

/**
 * Преобразует значение гендера в его русскоязычный эквивалент.
 * @param gender Пол (male, female, N/A).
 * @returns Строка, содержащая соответствующий гендер на русском языке (Мужской, Женский, N/A).
 */
export function translateGender(gender: string): string {
  switch (gender.toLowerCase()) {
    case 'male':
      return 'Мужской';
    case 'female':
      return 'Женский';
    case 'n/a':
      return 'N/A';
    default:
      return 'N/A'; // Если значение не распознано, возвращаем 'N/A'
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