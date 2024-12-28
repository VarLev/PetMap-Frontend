
interface IChat {
  id: string;
  lastMessage?: string;
  lastCreatedAt: number;
  participants: {key: string, value: IChatUser}[];
  lastSeen?: number;
}

interface IChatUser {
  id: string;
  firstName: string;
  imageUrl?: string;
  isOnline?: boolean;
  lastSeen?: number;
  lastMessage?: string;
}
