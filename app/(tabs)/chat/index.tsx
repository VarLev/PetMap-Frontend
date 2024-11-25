import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import ChatStore from "@/stores/ChatStore";
import { Divider, IconButton } from "react-native-paper";
import ChatMenu from "@/components/chat/ChatMenu";
import EmptyChatScreen from "@/components/chat/EmptyChatScreen";

const ChatListItem: React.FC<{
  item: (typeof ChatStore.chats)[0];
}> = ({ item }) => {
  const router = useRouter();
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [lastSeen, setLastSeen] = useState<number | null>(null);

  //достаем время последнего посещения всех участников чата
  const fetchLastSeen = async () => {
    try {
      const userId = item.id.slice(36, 72);
      ChatStore.lastSeen[userId] = await ChatStore.getLastSeen(userId);
      await ChatStore.setLastSeen();
      setLastSeen(ChatStore.lastSeen[userId]);
    } catch (error) {
      console.error("Error fetching last seen:", error);
    }
  };
  // нужно бкдет доработать, убрать обращение к базе

  const fetchLastMessage = async () => {
    const message = await ChatStore.getLastMessage(item.id);
    setLastMessage(message);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLastSeen();
      await fetchLastMessage();
    };
    fetchData();
  }, [item.id]);

  const handleOpenChat = () => {
    router.push(`/chat/${item?.id}?otherUserId=${item.otherUserId}`);
    console.log("open chat: ", item.id);
  };

  const handleOpenProfile = () => {
    console.log(`open user profile: ${item.otherUserName}`);
    router.push(`/(tabs)/profile/${item.otherUserId}`);
    // открытие профиля собеседника тапая по аватару
  };

  const shortenName = (name: string | undefined) => {
    if (!name) return ''
    if (name.length > 10) {
      return name.slice(0, 20) + '...'
    } else {
      return name
    }
  }

  return (
    <TouchableOpacity onPress={handleOpenChat}>
      <View className="flex-row justify-between p-1 ml-4 items-center h-17 bg-gray-100 rounded-l-xl ">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              handleOpenProfile();
            }}
          >
            <Image
              source={{
                uri: item?.thumbnailUrl ?? "https://i.pravatar.cc/200",
              }}
              className="rounded-xl h-16 w-16"
            />
          </TouchableOpacity>
          <View className="flex-col pl-4 ">
            <Text className="text-black text-[16px] font-nunitoSansBold">
              {shortenName(item.otherUserName)}
            </Text>
            <Text className="text-gray-600">
              {lastMessage ?? "Загрузка..."}
            </Text>
          </View>
        </View>
        <ChatMenu chatId={item?.id} otherUserId={item.otherUserId} />
      </View>
      <Divider bold className="bg-gray-400" />
    </TouchableOpacity>
  );
};

const ChatListScreen: React.FC = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      ChatStore.sortChats();
    }
  }, [isLoading, ChatStore.chats]);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      ChatStore.sortChats();
      await ChatStore.fetchChats();
    } catch (err) {
      setError("Failed to load chats");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading chats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <>
      {ChatStore.chats.length === 0 && <EmptyChatScreen />}
      <View className="h-full">
        <View className="flex-row items-center justify-start gap-2 p-2 mt-4">
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.push("(tabs)/map")}
          />
          <Text className="text-lg font-nunitoSansBold pb-1">Сообщения</Text>
        </View>
        <FlatList
          data={ChatStore.sortedChats}
          renderItem={({ item }) => <ChatListItem item={item} />}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#6200ee"]}
            />
          }
        />
        {/* <Surface elevation={5} className="h-24 bg-white" children={undefined} /> */}
      </View>
    </>
  );
});

export default ChatListScreen;
