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
  if (!birthDate || !(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    return ''; // Возвращаем пустую строку, если birthDate некорректный
  }

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
    return `${ageYears} y.`;
  } else {
    return ageYears.toString();
  }
}

/**
 * Возвращает иконку пола в зависимости от переданного значения.
 * @param gender Пол (male, female или другое).
 * @returns Иконка в виде строки.
 */
export function getGenderIcon(gender: number): string {
  switch (gender) {
    case 1:
      return 'male';
    case 0:
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
export function translateGender(gender: number): string {
  switch (gender) {
    case 0:
      return 'Мужской';
    case 1:
      return 'Женский';
    case 2:
      return 'N/A';
    default:
      return 'N/A'; // Если значение не распознано, возвращаем 'N/A'
  }
}

export function setUserAvatarDependOnGender(user: IUser): string {
  const randomIndex = Math.floor(Math.random() * avatarsStringF.length);
  if(user.gender){
    if(user.gender === 1){
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

/**
 * Преобразует строку в формате YYYY-MM-DD в объект Date.
 * @param dateString Строка с датой в формате YYYY-MM-DD.
 * @returns Объект Date, представляющий указанную дату, или null, если формат некорректен.
 */
export function parseStringToDate(dateString: string): Date | null {
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Проверяем, что год, месяц и день являются допустимыми числами
  if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
    // Проверяем, что месяц и день находятся в допустимом диапазоне
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return new Date(year, month - 1, day);
    }
  }

  return null; // Возвращаем null, если строка не соответствует формату YYYY-MM-DD
}

export function parseDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяц добавляем +1, так как индексация месяцев начинается с 0
  const day = date.getDate().toString().padStart(2, '0'); // Добавляем ведущий 0 для чисел < 10

  return `${year}-${month}-${day}`;
}


export function getTagsByIndex(tagsArray: string[], indexes: number | number[] | undefined): string | string[] |null {
  if (Array.isArray(indexes)) {
    // Если передан массив индексов, возвращаем массив соответствующих значений
    return indexes.map(index => tagsArray[index]);
  } else if(indexes !== undefined) {
    // Если передан один индекс, возвращаем одно значение
    return tagsArray[indexes];
  }
  return null;
}