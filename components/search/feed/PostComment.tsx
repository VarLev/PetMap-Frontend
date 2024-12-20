import { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet, View } from 'react-native';
import { Avatar, Menu, Text, TouchableRipple } from 'react-native-paper';
import { ICommentWithUser } from "@/dtos/Interfaces/feed/IPost";
import { router } from "expo-router";
import MenuItemWrapper from "@/components/custom/menuItem/MunuItemWrapper";
import userStore from "@/stores/UserStore";
import i18n from "@/i18n";
import ComplaintModal from "@/components/custom/complaint/ComplaintModal";

type PostCommentProps = {
  comment: ICommentWithUser;
  handleDeleteComment: (commentId: string) => void;
}

const PostComment: FC<PostCommentProps> = observer(({comment, handleDeleteComment}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isComplaintModal, setIsComplaintModal] = useState<boolean>(false);
  const [isComplaintDone, setIsComplaintDone] = useState(false);
  const [isComplaintSuccess, setIsComplaintSuccess] = useState(false);

  useEffect(() => {
    if (comment.userId === userStore.currentUser?.id) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
    }
  }, [])

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const timeSince = (date: Date) => {
    const periods = [
      { time: 31536000, name: i18n.t("feedPosts.commentCreatedAtPeriods.years") },
      { time: 2592000, name: i18n.t("feedPosts.commentCreatedAtPeriods.monthes") },
      { time: 604800, name: i18n.t("feedPosts.commentCreatedAtPeriods.weeks") },
      { time: 86400, name: i18n.t("feedPosts.commentCreatedAtPeriods.days") },
      { time: 3600, name: i18n.t("feedPosts.commentCreatedAtPeriods.houres") },
      { time: 60, name: i18n.t("feedPosts.commentCreatedAtPeriods.minutes") },
      { time: 1, name: i18n.t("feedPosts.commentCreatedAtPeriods.seconds") }
    ];

    let elapsed = Math.floor((Date.now() - +new Date(date)) / 1000);

    for (let { time, name } of periods) {
      if (elapsed >= time) {
        let count = Math.floor(elapsed / time);
        return elapsed < 10 ? i18n.t("feedPosts.commentCreatedAtPeriods.now") : `${count} ${name}`;
      }
    }
  }

  const deleteComment = () => {
    handleDeleteComment(comment.id);
    setMenuVisible(false);
  }

  const handleComplain = () => {
    setMenuVisible(false);
    setIsComplaintModal(true);
  }

  const openUserProfile = (userId: string) => {
    router.push(`/(tabs)/profile/${userId}`);
  }

  const closeComplaintModal = () => {
    setIsComplaintModal(false);
  }

  const onComplain = async (text: string) => {
    // await searchStore.complainOnPost(post.id, text)
    //   .then(() => {
    //     setIsComplaintDone(true);
    //     setIsComplaintSuccess(true);
    //   })
    //   .catch(() => {
    //     setIsComplaintDone(true);
    //     setIsComplaintSuccess(false);
    //   })
  } 
 
  return (
    <Menu
      visible={menuVisible}
      onDismiss={closeMenu}
      contentStyle={styles.menu}
      anchor={
        <View style={styles.comment}>
          <TouchableRipple onLongPress={openMenu} >
            <View className="flex-row items-start gap-x-1 my-1.5">
              <TouchableRipple onPress={() => openUserProfile(comment.userId)}>
                <Avatar.Image size={28} source={{ uri: `${comment.userAvatar}` }} />
              </TouchableRipple>
              <View className="flex-column">
                <View className="flex-row gap-1">
                  <TouchableRipple onPress={() => openUserProfile(comment.userId)}>
                    <Text className="font-bold text-gray-500 text-xs">{comment.userName}</Text>
                  </TouchableRipple>
                  <Text className="text-gray-500 text-xs">
                    {timeSince(comment.createdAt)}
                  </Text>
                </View>
                <Text className="text-sm pr-1">{comment.content}</Text>
              </View>
            </View>
          </TouchableRipple>
          <ComplaintModal
            isVisible={isComplaintModal}
            handleCloseModal={closeComplaintModal}
            handleComplain={(text) => onComplain(text)}
            isComplaintDone={isComplaintDone}
            isComplaintSuccess={isComplaintSuccess}
          />
        </View>
      }
    >
      {isCurrentUser ? 
      <MenuItemWrapper
        onPress={deleteComment}
        title="Удалить"
      /> :
      <MenuItemWrapper
        onPress={handleComplain}
        title="Пожаловаться"
      />}
    </Menu>
  )
})

const styles = StyleSheet.create({
  menu: {
    backgroundColor: "white",
    paddingVertical: 0,
    left: 160,
    top: 60
  },
  comment: {
    overflow: "hidden",
    borderRadius: 12,
    paddingHorizontal: 12
  },
  complaint: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 24,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 12
  }
});

export default PostComment;