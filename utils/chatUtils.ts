import UserStore from '@/stores/UserStore';

export function generateChatIdForTwoUsers(user1Id: string, user2Id: string): string {
  return [user1Id, user2Id].sort().join('_');
}

export function generateChatData(chatId: string, currentUserId: string, otherUserId: string, otherUser: IChatUser, lastMessages?:string): IChat {
  return {
    id: chatId,
    participants: [
      {
        key: currentUserId,
        value: {
          id: currentUserId,
          name: UserStore.currentUser?.name ?? '',
          avatar: UserStore.currentUser?.thumbnailUrl ?? '',
          isOnline: UserStore.currentUser?.isOnline ?? false,
        },
      },
      {
        key: otherUserId,
        value: {
          id: otherUserId,
          name: otherUser?.name ?? '',
          avatar: otherUser?.avatar ?? '',
          isOnline: otherUser?.avatar ? true : false,
        },
      },
    ],
    lastMessage: lastMessages,
    lastCreatedAt: Date.now(),
  };
}