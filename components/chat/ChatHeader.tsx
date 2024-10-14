import { Text, View, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { router } from "expo-router";
import ChatStore from "@/stores/ChatStore";


const ChatHeader = ({ item }) => {

 const getChatData = () => {
        return item ? ChatStore.chats.find((chat) => chat.id === item) : null;
 }   
  
  const chatData = getChatData();



  const handleBack = () => {
    router.back(); 
  };

  return (
    <> 
    
      <View className="flex-row items-center justify-start gap-2 py-2">
        <IconButton icon="arrow-left" size={24} onPress={handleBack} />
        <Image
          source={{
            uri: chatData?.thumbnailUrl ?? "https://i.pravatar.cc/200",
          }}
          className="rounded-xl h-16 w-16"
        />
        <View>
        <Text className="text-lg font-nunitoSansBold">{chatData?.otherUserName}</Text>
        <Text className="text-[13px] font-nunitoSansRegular text-[#87878A]">был(а) в 22:01</Text>
        </View>
   
      </View>
    </>
  );
};

export default ChatHeader;
