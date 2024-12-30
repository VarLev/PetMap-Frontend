import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Menu, Button, Switch, TouchableRipple } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import ChatStore from "@/stores/ChatStore";
import CustomConfirmAlert from "../../custom/alert/CustomConfirmAlert";
import MenuItemWrapper from "@/components/custom/menuItem/MunuItemWrapper";
import userStore from "@/stores/UserStore";
import i18n from "@/i18n";

interface IChatMenuProps {
  chatId: string;
  otherUserId: string | undefined;
}

const ChatMenu = ({ chatId, otherUserId }: IChatMenuProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [requestVisibleDel, setRequestVisibleDel] = useState(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const MySwitch = ({ value }: { value: boolean }) => {
    return <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />;
  };

  const handleDelete = () => {
    setRequestVisibleDel(true);
  };

  const deleteChat = async (chatId: string) => {
    console.log("Deleting chat", ChatStore.chats);
    await ChatStore.deleteChat(chatId);
    setRequestVisibleDel(false);
    setVisible(false);
  };

  const handleBlock = () => {
    setRequestVisible(true);
  };

  useEffect(() => {
    const userId = userStore.currentUser?.id;
    if (userId && otherUserId) {
      const isBlocked = ChatStore.checkBlocked(userId, otherUserId);
      setIsBlocked(isBlocked);
      setIsUserBlocked(isBlocked);
    }
  }, []);

  const blockUser = async (otherUserId: string) => {
    try {
      if (!isUserBlocked) {
        await ChatStore.addBlacklist(otherUserId);
        console.log("Blocking user", otherUserId);
        setIsUserBlocked(true);
        setIsBlocked(true);
      } else {
        await ChatStore.removeBlacklist(otherUserId);
        console.log("Unblocking user", otherUserId);
        setIsUserBlocked(false);
        setIsBlocked(false);
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    } finally {
      setRequestVisible(false);
      setVisible(false);
    }
  };
  

  return (
    <View className="mr-2">
    <View>
      <Menu
        style={{ marginTop: 25 }}
        contentStyle={{ backgroundColor: "#ffffff" }}
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <View className="overflow-hidden rounded-full">
            <TouchableRipple onPress={openMenu} rippleColor="#E8DFFF">
              <Button>
                <FontAwesome6 name="bars-staggered" size={20} color="#212121" />
              </Button>
            </TouchableRipple>
          </View>
        }
      >
        {/* <View className="flex-row items-center justify-between">
          <MenuItemWrapper
            icon="bell-outline"
            onPress={onToggleSwitch}
            title={i18n.t("chat.title")} 
          />
          <MySwitch value={isSwitchOn} />
        </View> */}
  
        <MenuItemWrapper
          icon={isBlocked ? "lock-outline" : "lock-open-outline"}
          onPress={() => {
            handleBlock();
          }}
          title={
            isBlocked
              ? i18n.t("chat.unblock") 
              : i18n.t("chat.block") 
          }
        />
        <MenuItemWrapper
          icon="delete-outline"
          onPress={() => {
            handleDelete();
          }}
          title={i18n.t("chat.deleteChat")}
        />
      </Menu>
    </View>
    <CustomConfirmAlert
      isVisible={requestVisible}
      onClose={() => {
        setRequestVisible(false);
      }}
      onConfirm={() => otherUserId && blockUser(otherUserId)}
      message={
        isBlocked
          ? `${i18n.t('chat.unblockUser')}?` 
          : i18n.t("chat.sureBlock") 
      }
      title={
        isBlocked
          ? i18n.t("chat.unblockUser") 
          : i18n.t("chat.blockUser") 
      }
      confirmText={i18n.t("chat.ok")} 
      cancelText={i18n.t("chat.cancel")} 
    />
    <CustomConfirmAlert
      isVisible={requestVisibleDel}
      onClose={() => {
        setRequestVisibleDel(false);
      }}
      onConfirm={() => deleteChat(chatId)}
      message={i18n.t("chat.deleteChatMessage")} 
      title={i18n.t("chat.deleteChat")} 
      confirmText={i18n.t("chat.ok")} 
      cancelText={i18n.t("chat.cancel")} 
    />
  </View>
  
  );
};

export default ChatMenu;
