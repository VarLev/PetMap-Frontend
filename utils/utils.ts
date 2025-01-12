import { avatarsStringF, avatarsStringM } from "@/constants/Avatars";
import { IUser } from "@/dtos/Interfaces/user/IUser";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import i18n from "@/i18n";




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
      return `${ageMonths} ${getAgeUnit(ageMonths, 'month')}`;
    } else {
      return `${ageYears} ${getAgeUnit(ageYears, 'year')}`;
    }
  } else {
    return 'Unknown';
  }
}

/**
* Возвращает склонение единицы измерения возраста в зависимости от возраста.
* @param age Возраст.
* @param unit Единица измерения возраста.
* @returns Локализованная единица измерения возраста в правильном склонении
*/
function getAgeUnit(age: number, unit: "month" | "year"): string {
  // Для русского языка
  if (i18n.locale === 'ru') {
    const lastTwoDigits = age % 100;
    // От 5 до 20: "месяцев"/"лет"
    if (lastTwoDigits >= 5 && lastTwoDigits <= 20) {
      return i18n.t(`PetProfile.ageUnits.${unit}.many`);
    } else {
      const lastDigit = lastTwoDigits % 10;
      // Все значения, заканчивающиеся на 1, кроме 11: "месяц"/"год"
      if (lastDigit === 1) {
        return i18n.t(`PetProfile.ageUnits.${unit}.one`)
      } 
      // Все значения, заканчивающиеся на 2-4: "месяца"/"года"
      else if (lastDigit >= 2 && lastDigit <= 4) {
        return i18n.t(`PetProfile.ageUnits.${unit}.few`);
      } 
      // Для всех остальных значений: "месяцев"/"лет"
      else {
        return i18n.t(`PetProfile.ageUnits.${unit}.many`);
      }
    }
  }
  // Для остальных языков
  return age === 1
    ? i18n.t(`PetProfile.ageUnits.${unit}.one`)  //Английский: "month"/"year", Испанский: "mes"/"año"
    : i18n.t(`PetProfile.ageUnits.${unit}.many`); //Английский: "months"/"years", Испанский: "meses"/"años"
}


/**
 * Вычисляет возраст собаки в годах или месяцах в зависимости от даты рождения.
 * @param birthDate Дата рождения собаки.
 * @returns Возраст собаки в строковом формате.
 */
export function calculateShortDogAge(birthDate?: Date | null | undefined): string {
  if (!birthDate) return 'Unknown';

  // Если birthDate является строкой, пaреобразуем её в объект Date
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
      return `${ageMonths} ${i18n.t('PetProfile.ageUnits.shortMonth')}`;
    } else {
      if (i18n.locale === 'ru') {
        return `${ageYears} ${(ageYears % 100 >= 11 && ageYears % 100 <= 20) || ageYears % 10 === 0 || ageYears % 10 >= 5 ? i18n.t('PetProfile.ageUnits.shortYear.many') : i18n.t('PetProfile.ageUnits.shortYear.few')}`
      } else {
        return `${ageYears} ${i18n.t('PetProfile.ageUnits.shortYear.few')}`;
      }
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
    return `${ageMonths}`;
  } else if (ageMonths > 0) {
    return `${ageYears}`;
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
      return new Date(Date.UTC(year, month - 1, day)); // Привести к UTC
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
          i18n.t("WalkDetails.everyDayAt") +
          (hours < 10 ? "0" + hours : hours) +
          ":" +
          (minutes < 10 ? "0" + minutes : minutes)
        );
      }
      return i18n.t("WalkDetails.everyDay");
    } else {
      const formattedTime =
        advrt.startTime !== undefined
          ? `${String(Math.floor(advrt.startTime / 60)).padStart(2, "0")}:${String(
              advrt.startTime % 60
            ).padStart(2, "0")}`
          : i18n.t("WalkDetails.timeNotSpecified");

      return (
        advrt.selectedDays
          ?.map((day) => [i18n.t("WalkDetails.monday"), i18n.t("WalkDetails.tuesday"), i18n.t("WalkDetails.wednesday"), i18n.t("WalkDetails.thursday"), i18n.t("WalkDetails.friday"), i18n.t("WalkDetails.saturday"), i18n.t("WalkDetails.sunday")][day])
          .join(", ") +
          i18n.t("WalkDetails.in") +
        formattedTime
      );
    }
  } else {
    const formattedTime =
      advrt.startTime !== undefined
        ? `${String(Math.floor(advrt.startTime / 60)).padStart(2, "0")}:${String(
            advrt.startTime % 60
          ).padStart(2, "0")}`
        : i18n.t("WalkDetails.timeNotSpecified");

    return advrt.date
      ? new Date(advrt.date).toLocaleDateString() + i18n.t("WalkDetails.in") + formattedTime
      : i18n.t("WalkDetails.dateNotSpecified");
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
  const daysText = days > 0 ? `${days} ${days % 10 === 1 && days % 100 !== 11 ? i18n.t("WalkDetails.day") : days % 10 >= 2 && days % 10 <= 4 && !(days % 100 >= 12 && days % 100 <= 14) ? i18n.t("WalkDetails.daysTwo") : i18n.t("WalkDetails.daysFew")}` : '';
  const hoursText = hours > 0 ? `${hours} ${hours % 10 === 1 && hours % 100 !== 11 ? i18n.t("WalkDetails.hour") : hours % 10 >= 2 && hours % 10 <= 4 && !(hours % 100 >= 12 && hours % 100 <= 14) ? i18n.t("WalkDetails.hoursTwo") : i18n.t("WalkDetails.hoursFew")}` : '';
  const minutesText = minutes > 0 ? `${minutes} ${minutes % 10 === 1 && minutes % 100 !== 11 ? i18n.t("WalkDetails.minuteOne") : minutes % 10 >= 2 && minutes % 10 <= 4 && !(minutes % 100 >= 12 && minutes % 100 <= 14) ? i18n.t("WalkDetails.minutesTwo") : i18n.t("WalkDetails.minutesFew")}` : '';

  return `${i18n.t("WalkDetails.afterSomeTime")} ${[daysText, hoursText, minutesText].filter(Boolean).join(" ")}`;
};



export async function compressImage(uri: string): Promise<string> {
  const manipResult = await manipulateAsync(
    uri,
    [{ resize: { width: 400 } }], // Изменение размера изображения
    { compress: 0.5, format: SaveFormat.JPEG }
  );
  return manipResult.uri;
}

export const shortenName = (name: string | undefined, maxLength: number = 20) => {
  if (!name) return ''
  if (name.length > maxLength) {
    return name.slice(0, maxLength) + '...'
  } else {
    return name
  }
};