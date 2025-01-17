
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
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: number;
  lastMessage?: string;
  fmcToken?: string | null;
}


interface IChatAIMessage {
  role : 'assistant' | 'user';
  content: string;
}