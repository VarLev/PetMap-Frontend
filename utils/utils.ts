import { avatarsStringF, avatarsStringM } from "@/constants/Avatars";
import { IUser } from "@/dtos/Interfaces/user/IUser";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';





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

/**
 * Вычисляет расстояние между двумя точками (координатами) на Земле.
 * @param lat1 Широта первой точки (например, пользователя).
 * @param lon1 Долгота первой точки (например, пользователя).
 * @param lat2 Широта второй точки (например, целевая точка).
 * @param lon2 Долгота второй точки (например, целевая точка).
 * @returns Расстояние в километрах.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Радиус Земли в километрах
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Расстояние в километрах
  return parseFloat(distance.toFixed(3));
}

/**
* Преобразует градусы в радианы.
* @param deg Значение в градусах.
* @returns Значение в радианах.
*/
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Преобразует расстояние в строковый формат, показывая километры и метры.
 * @param distance Расстояние в километрах (может быть null).
 * @returns Строка, представляющая расстояние в километрах и/или метрах.
 */
export function convertDistance(distance: number | null): string {
  console.log('distance', distance);
  if (!distance) return "..."; // Если distance пустой, возвращаем "Место"

  if (distance < 1) {
    // Если меньше 1 км, переводим в метры
    const meters = Math.round(distance * 1000);
    return `${meters} m`;
  } else {
    // Если больше 1 км, показываем километры и метры
    const kilometers = Math.floor(distance);
    const meters = Math.round((distance - kilometers) * 1000);
    return `${kilometers} km ${meters > 0 ? meters + " m" : ""}`.trim();
  }
}


export const renderWalkDetails = (advrt: IWalkAdvrtDto) => {
  if (advrt.isRegular) {
    if (advrt.selectedDays?.length === 7) {
      if (advrt.startTime) {
        const hours = Math.floor(advrt.startTime / 60);
        const minutes = advrt.startTime % 60;
        return (
          "Каждый день в " +
          (hours < 10 ? "0" + hours : hours) +
          ":" +
          (minutes < 10 ? "0" + minutes : minutes)
        );
      }
      return "Каждый день";
    } else {
      const formattedTime =
        advrt.startTime !== undefined
          ? `${String(Math.floor(advrt.startTime / 60)).padStart(2, "0")}:${String(
              advrt.startTime % 60
            ).padStart(2, "0")}`
          : "Время не указано";

      return (
        advrt.selectedDays
          ?.map((day) => ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"][day])
          .join(", ") +
        " в " +
        formattedTime
      );
    }
  } else {
    const formattedTime =
      advrt.startTime !== undefined
        ? `${String(Math.floor(advrt.startTime / 60)).padStart(2, "0")}:${String(
            advrt.startTime % 60
          ).padStart(2, "0")}`
        : "Время не указано";

    return advrt.date
      ? new Date(advrt.date).toLocaleDateString() + " в " + formattedTime
      : "Дата не указана";
  }
};

export const calculateTimeUntilNextWalk = (advrt: IWalkAdvrtDto): string | undefined => {
  const now = new Date();
  let nextWalk: Date | undefined;

  // Преобразуем текущий день недели: 0 = Понедельник, 6 = Воскресенье
  const getAdjustedDay = (day: number) => (day === 0 ? 6 : day - 1);
  const currentDay = getAdjustedDay(now.getDay());

  if (advrt.isRegular) {
    if (advrt.selectedDays?.length === 7 && advrt.startTime !== undefined) {
      // Прогулки каждый день
      nextWalk = new Date();
      nextWalk.setHours(Math.floor(advrt.startTime / 60), advrt.startTime % 60, 0, 0);
      if (nextWalk <= now) nextWalk.setDate(nextWalk.getDate() + 1);
    } else if (advrt.selectedDays && advrt.selectedDays.length > 0) {
      const sortedDays = advrt.selectedDays.sort((a, b) => a - b);
      
      // Найдём следующий день для прогулки
      let nextDay = sortedDays.find(day => day > currentDay) ?? sortedDays[0];
      let daysUntilNextWalk = (nextDay - currentDay + 7) % 7;

      nextWalk = new Date();
      nextWalk.setDate(now.getDate() + daysUntilNextWalk);

      if (advrt.startTime !== undefined) {
        const startHours = Math.floor(advrt.startTime / 60);
        const startMinutes = advrt.startTime % 60;
        nextWalk.setHours(startHours, startMinutes, 0, 0);

        // Если прогулка сегодня, но время уже прошло, сдвигаем на следующий день
        if (daysUntilNextWalk === 0 && nextWalk <= now) {
          nextDay = sortedDays[(sortedDays.indexOf(nextDay) + 1) % sortedDays.length];
          daysUntilNextWalk = (nextDay - currentDay + 7) % 7;
          nextWalk.setDate(now.getDate() + daysUntilNextWalk);
          nextWalk.setHours(startHours, startMinutes, 0, 0);
        }
      }
    }
  } else if (advrt.date) {
    nextWalk = new Date(advrt.date);
  }

  if (!nextWalk) return undefined;

  // Вычисление разницы во времени
  const diffMs = nextWalk.getTime() - now.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Форматируем вывод с правильными окончаниями
  const daysText = days > 0 ? `${days} ${days % 10 === 1 && days % 100 !== 11 ? 'день' : days % 10 >= 2 && days % 10 <= 4 && !(days % 100 >= 12 && days % 100 <= 14) ? 'дня' : 'дней'}` : '';
  const hoursText = hours > 0 ? `${hours} ${hours % 10 === 1 && hours % 100 !== 11 ? 'час' : hours % 10 >= 2 && hours % 10 <= 4 && !(hours % 100 >= 12 && hours % 100 <= 14) ? 'часа' : 'часов'}` : '';
  const minutesText = minutes > 0 ? `${minutes} ${minutes % 10 === 1 && minutes % 100 !== 11 ? 'минуту' : minutes % 10 >= 2 && minutes % 10 <= 4 && !(minutes % 100 >= 12 && minutes % 100 <= 14) ? 'минуты' : 'минут'}` : '';

  return `Через ${[daysText, hoursText, minutesText].filter(Boolean).join(" ")}`;
};



export async function compressImage(uri: string): Promise<string> {
  const manipResult = await manipulateAsync(
    uri,
    [{ resize: { width: 400 } }], // Изменение размера изображения
    { compress: 0.5, format: SaveFormat.JPEG }
  );
  return manipResult.uri;
}
