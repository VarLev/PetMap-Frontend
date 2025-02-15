// analyticsService.ts

import { getApp } from '@react-native-firebase/app';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';

/**
 * Инициализация Analytics
 */
const rnApp = getApp();
const analyticsInstance = getAnalytics(rnApp);

/**
 * Универсальный метод логирования события
 * @param eventName Название события
 * @param eventParams Параметры события
 */
export const logAnalyticsEvent = async (eventName: string, eventParams: Record<string, any> = {}): Promise<void> => {
  try {
    await logEvent(analyticsInstance, eventName, eventParams);
    console.log(`Событие "${eventName}" отправлено с параметрами:`, eventParams);
  } catch (error) {
    console.error(`Ошибка при логировании события "${eventName}":`, error);
  }
};

/* ============================================================================
 *                             Аутентификация / Профиль
 * ============================================================================
 */

/**
 * Логируем успешную регистрацию
 * @param method способ регистрации (например, 'email', 'google', 'apple')
 */
export const logSignUp = async (method: string) => {
  await logAnalyticsEvent('sign_up', { method });
};

/**
 * Логируем успешный вход в приложение
 * @param method способ входа (например, 'email', 'google', 'apple')
 */
export const logLogin = async (method: string) => {
  await logAnalyticsEvent('login', { method });
};

/**
 * Логируем выход из приложения
 */
export const logLogout = async () => {
  await logAnalyticsEvent('logout');
};

/**
 * Логируем просмотр чьего-то профиля
 * @param viewedUserId ID пользователя, чей профиль просматривают
 */
export const logViewProfile = async (viewedUserId: string) => {
  await logAnalyticsEvent('view_profile', { viewedUserId });
};

/**
 * Логируем обновление собственного профиля (имя, аватар и т.д.)
 */
export const logUpdateProfile = async () => {
  await logAnalyticsEvent('update_profile');
};

/**
 * Логируем ошибку при входе
 * @param method Способ входа (email, google, apple и т.д.)
 * @param errorMessage Текст ошибки
 */
export const logLoginError = async (method: string, errorMessage: string) => {
  await logAnalyticsEvent('login_error', { method, errorMessage });
};

/**
 * Логируем нажатие на "Забыли пароль" (или начало процесса сброса пароля)
 * @param email Email пользователя (необязательно, если не хотите передавать)
 */
export const logForgotPassword = async (email?: string) => {
  await logAnalyticsEvent('forgot_password', { email });
};

/* ============================================================================
 *                           Работа с питомцами
 * ============================================================================
 */

/**
 * Логируем просмотр профиля питомца
 * @param petId ID питомца, чей профиль просматривают
 * @param status Статус питомца (например, 'has_owner', 'lost', 'adoption')
 */
export const logViewPetProfile = async (petId: string, status: string) => {
  await logAnalyticsEvent('view_pet_profile', { petId, status });
};

/**
 * Логируем обновление профиля питомца (изменение статуса, информации и пр.)
 * @param petId ID питомца
 * @param newStatus новый статус ('has_owner', 'lost', 'adoption')
 */
export const logUpdatePetProfile = async (petId: string, newStatus: string) => {
  await logAnalyticsEvent('update_pet_profile', { petId, newStatus });
};

/**
 * Логируем фильтрацию списка питомцев
 * @param filterType тип фильтра (например, 'has_owner', 'lost', 'adoption')
 */
export const logFilterPets = async (filterType: string) => {
  await logAnalyticsEvent('filter_pets', { filterType });
};

/* ============================================================================
 *                           Работа с картой и метками
 * ============================================================================
 */

/**
 * Логируем создание метки на карте (для совместной прогулки)
 * @param locationCoordinates координаты метки (широта, долгота) или любая другая локационная информация
 */
export const logCreateMapMarker = async (locationCoordinates: { lat: number; lng: number }) => {
  await logAnalyticsEvent('create_map_marker', { ...locationCoordinates });
};

/**
 * Логируем отмену создания метки (если пользователь начал, но передумал)
 */
export const logCreateMapMarkerCanceled = async () => {
  await logAnalyticsEvent('create_map_marker_canceled');
};

/**
 * Логируем ошибку при создании метки
 * @param errorMessage Текст ошибки
 */
export const logCreateMapMarkerError = async (errorMessage: string) => {
  await logAnalyticsEvent('create_map_marker_error', { errorMessage });
};

/**
 * Логируем поиск (по карте) меток от других пользователей
 * @param searchParams объект, содержащий параметры поиска (радиус, фильтры и т.д.)
 */
export const logSearchMapMarkers = async (searchParams: Record<string, any>) => {
  await logAnalyticsEvent('search_map_markers', { ...searchParams });
};

/**
 * Логируем просмотр конкретной метки (например, клик по ней на карте)
 * @param markerId ID метки
 */
export const logViewMapMarker = async (markerId: string) => {
  await logAnalyticsEvent('view_map_marker', { markerId });
};

/**
 * Логируем начало прогулки (или встречи)
 * @param markerId ID метки, по которой договорились встретиться
 * @param participants Список ID участников
 */
export const logWalkStarted = async (markerId: string, participants: string[]) => {
  await logAnalyticsEvent('walk_started', { markerId, participants });
};

/**
 * Логируем успешное завершение прогулки (или встречи)
 * @param markerId ID метки
 * @param participants Список ID участников
 */
export const logWalkCompleted = async (markerId: string, participants: string[]) => {
  await logAnalyticsEvent('walk_completed', { markerId, participants });
};

/* ============================================================================
 *                                Чат
 * ============================================================================
 */

/**
 * Логируем открытие (переход в) чат с конкретным пользователем или группой
 * @param chatId ID чата
 */
export const logOpenChat = async (chatId: string) => {
  await logAnalyticsEvent('open_chat', { chatId });
};

/**
 * Логируем отправку сообщения
 * @param chatId ID чата
 * @param recipientId ID получателя (или массива получателей)
 */
export const logSendMessage = async (chatId: string, recipientId: string) => {
  await logAnalyticsEvent('send_message', { chatId, recipientId });
};

/**
 * Логируем получение/чтение сообщения
 * @param chatId ID чата
 * @param senderId ID отправителя
 */
export const logReceiveMessage = async (chatId: string, senderId: string) => {
  await logAnalyticsEvent('receive_message', { chatId, senderId });
};

/* ============================================================================
 *                           Пост-лента / Соц. функционал
 * ============================================================================
 */

/**
 * Логируем просмотр ленты (списка постов)
 */
export const logViewFeed = async () => {
  await logAnalyticsEvent('view_feed');
};

/**
 * Логируем просмотр конкретного поста
 * @param postId ID поста
 */
export const logViewPost = async (postId: string) => {
  await logAnalyticsEvent('view_post', { postId });
};

/**
 * Логируем создание нового поста
 * @param postId ID нового поста (если доступен)
 */
export const logCreatePost = async (postId?: string) => {
  await logAnalyticsEvent('create_post', { postId });
};

/**
 * Логируем лайк поста
 * @param postId ID поста, который лайкают
 */
export const logLikePost = async (postId: string) => {
  await logAnalyticsEvent('like_post', { postId });
};

/**
 * Логируем добавление комментария к посту
 * @param postId ID поста
 * @param commentId ID комментария (необязательно)
 */
export const logCommentPost = async (postId: string, commentId?: string) => {
  await logAnalyticsEvent('comment_post', { postId, commentId });
};

/* ============================================================================
 *                           Доп. Монетизация / Подписки (опционально)
 * ============================================================================
 */

/**
 * Логируем покупку подписки
 * @param subscriptionPlan Название или ID плана подписки
 */
export const logPurchaseSubscription = async (subscriptionPlan: string) => {
  await logAnalyticsEvent('purchase_subscription', { subscriptionPlan });
};

/**
 * Логируем окончание пробного периода
 * @param subscriptionPlan Название или ID плана подписки
 */
export const logTrialEnd = async (subscriptionPlan: string) => {
  await logAnalyticsEvent('trial_end', { subscriptionPlan });
};

/* ============================================================================
 *                             Открытие экранов
 * ============================================================================
 */

/**
 * Логируем открытие экрана (screenName).
 * Этот метод стоит вызывать, когда экран становится видимым пользователю.
 */
export const logScreenView = async (screenName: string) => {
  await logAnalyticsEvent('screen_view', { screenName });
};
