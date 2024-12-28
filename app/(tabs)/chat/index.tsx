import React from 'react';
import { observer } from 'mobx-react-lite';
import ChatListView from '@/components/chat/chatList/ChatListView';


const ChatListScreen: React.FC = observer(() => {
  return (
    <ChatListView />
  );
});

export default ChatListScreen;
