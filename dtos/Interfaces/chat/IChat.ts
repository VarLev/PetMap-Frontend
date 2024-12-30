
interface IChat {
  id: string;
  lastMessage?: string;
  lastCreatedAt: number;
  participants: {key: string, value: IChatUser}[];
  lastSeen?: number;
}

interface IChatUser {
  id: string;
  name: string;
  thumbnailUrl?: string;
  isOnline?: boolean;
  lastSeen?: number;
  lastMessage?: string;
  fmcToken?: string | null;
}


