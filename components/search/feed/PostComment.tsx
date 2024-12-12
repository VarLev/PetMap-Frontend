import { FC } from "react";
import { observer } from "mobx-react-lite";
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { ICommentWithUser } from "@/dtos/Interfaces/feed/IPost";
import i18n from '@/i18n';

const PostComment: FC<{comment: ICommentWithUser}> = observer(({comment}) => {
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

  return (
    <View className="flex-row items-start gap-x-1 mt-2.5">
      <Avatar.Image size={28} source={{ uri: `${comment.userAvatar}` }} />
      <View className="flex-column">
        <View className="flex-row gap-1">
          <Text className="font-bold text-gray-500 text-xs">{comment.userName}</Text>
          <Text className="text-gray-500 text-xs">
            {timeSince(comment.createdAt)}
          </Text>
        </View>
        <Text className="text-sm pr-1">{comment.content}</Text>
      </View>
    </View>
  )
})

export default PostComment;