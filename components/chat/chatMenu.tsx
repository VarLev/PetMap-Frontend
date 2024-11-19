import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Menu, Button, Switch, TouchableRipple } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import ChatStore from "@/stores/ChatStore";
import CustomConfirmAlert from "../custom/alert/CustomConfirmAlert";
import MenuItemWrapper from "@/components/custom/menuItem/MunuItemWrapper";

interface IChatMenuProps {
  chatId: string;
  otherUserId: string | undefined;
}

const ChatMenu = ({ chatId, otherUserId }: IChatMenuProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [requestVisibleDel, setRequestVisibleDel] = useState(false);
  const [isIBlocked, setIsIBlocked] = useState<boolean>(false);

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

  const handleChekBlocked = async (otherUserId: string) => {
    if (await ChatStore.chekIfIBlocked()) {
      return setIsIBlocked(true);
    } else {
      return setIsIBlocked(false);
    }
  };
  useEffect(() => {
    if (otherUserId) {
      handleChekBlocked(otherUserId);
    }
  }, [otherUserId]);

  const blockUser = async (otherUserId: string) => {
    if (!isIBlocked) {
      await ChatStore.addBlacklist();
      console.log("Blocking user", otherUserId);
    } else {
      await ChatStore.removeBlacklist();
      console.log("Unblocking user", otherUserId);
    }
    setIsIBlocked(!isIBlocked);
    setRequestVisible(false);
    setVisible(false);
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
                  <FontAwesome6
                    name="bars-staggered"
                    size={20}
                    color="#212121"
                  />
                </Button>
              </TouchableRipple>
            </View>
          }
        >
          <View className="flex-row items-center justify-between">
            <MenuItemWrapper
              icon="bell-outline"
              onPress={onToggleSwitch}
              title="Уведомления"
            />
            <MySwitch value={isSwitchOn} />
          </View>

          <MenuItemWrapper
            icon={isIBlocked ? "lock-outline" : "lock-open-outline"}
            onPress={() => {
              handleBlock();
            }}
            title={isIBlocked ? "Разблокировать" : "Заблокировать"}
          />
          <MenuItemWrapper
            icon="delete-outline"
            onPress={() => {
              handleDelete();
            }}
            title="Удалить  чат"
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
          isIBlocked
            ? "Разблокировать пользователя?"
            : "Вы действительно хотите заблокировать пользователя?"
        }
        title={
          isIBlocked
            ? "Разблокировать пользователя"
            : "Заблокировать пользователя"
        }
        confirmText="Ок"
        cancelText="Отмена"
      />
      <CustomConfirmAlert
        isVisible={requestVisibleDel}
        onClose={() => {
          setRequestVisibleDel(false);
        }}
        onConfirm={() => deleteChat(chatId)}
        message="Вы действительно хотите удалить этот чат?"
        title="Удалить чат"
        confirmText="Ок"
        cancelText="Отмена"
      />
    </View>
  );
};

export default ChatMenu;
