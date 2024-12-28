import { IUser } from '@/dtos/Interfaces/user/IUser';
import { IUserChat } from '@/dtos/Interfaces/user/IUserChat';
import UserStore from '@/stores/UserStore';

export function generateChatIdForTwoUsers(user1Id: string, user2Id: string): string {
  return [user1Id, user2Id].sort().join('_');
}

export function generateChatData(chatId: string, currentUserId: string, otherUserId: string, otherUser: IUserChat, lastMessages?:string): IChat {
  return {
    id: chatId,
    participants: [
      {
        key: currentUserId,
        value: {
          id: currentUserId,
          firstName: UserStore.currentUser?.name ?? '',
          imageUrl: UserStore.currentUser?.thumbnailUrl ?? '',
          isOnline: false,
        },
      },
      {
        key: otherUserId,
        value: {
          id: otherUserId,
          firstName: otherUser?.name ?? '',
          imageUrl: otherUser?.thumbnailUrl ?? '',
          isOnline: false,
        },
      },
    ],
    lastMessage: lastMessages,
    lastCreatedAt: Date.now(),
  };
}
