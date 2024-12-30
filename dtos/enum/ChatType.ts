export enum ChatType {
  ChatExists = 0,
  NewChat = 1,
}

export type SendMessageOptions = {
  isInvite?: boolean; // если true, формируем кастомное сообщение
  inviteMetadata?: Record<string, any>;
  // любую доп.инфу (например, advrtId, visibleToUserId),
  // если хотим более гибко управлять полями "custom" сообщения
};
