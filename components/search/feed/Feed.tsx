// Feed.tsx
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { FlatList, View, ActivityIndicator, Text } from 'react-native';
import feedStore from '@/stores/FeedStore';
import PostItem from '@/components/search/feed/PostItem';
import CreatePost from '@/components/search/feed/CreatePost';
import CustomButtonPrimary from '@/components/custom/buttons/CustomButtonPrimary';
import BottomSheetComponent from '@/components/common/BottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet';

const Feed: React.FC = observer(() => {
 const [isSheetVisible, setIsSheetVisible] = React.useState(false);
 const [isRefreshing, setIsRefreshing] = React.useState(false);
 const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    feedStore.resetPage();
    feedStore.fetchPosts();
  }, []);

  const loadMorePosts = () => {
    //feedStore.incrementPage();
    //feedStore.fetchPosts();
  };

  const handleSheetClose = async () => {
   
  };

  const handleCreatePost = () => {
    setIsSheetVisible(true);
    sheetRef.current?.snapToIndex(0);
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    feedStore.resetPage();
    feedStore.fetchPosts().finally(() => {
      setIsRefreshing(false);
    });
  };
  
  return (
      <View className='flex-1'>
        <FlatList
          ListHeaderComponent={
            feedStore.posts.length === 0 ? (
              <View className='p-5' style={{ alignItems: 'center', marginTop: 20 }}>
                <Text>Нет постов.</Text>
                <Text>Создайте первый!</Text>
                <CustomButtonPrimary containerStyles='w-full' title="Написать" handlePress={handleCreatePost} />
              </View>
            ) : null
          }
          data={feedStore.posts}
          keyExtractor={(post) => post.id.toString()}
          renderItem={({ item }) => <PostItem post={item} />}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={feedStore.loading ? <ActivityIndicator size="large" /> : null}
        />
  
      {isSheetVisible && (
          <BottomSheetComponent
            ref={sheetRef}
            snapPoints={['60%', '100%']}
            renderContent={<CreatePost />}
            onClose={handleSheetClose} // Обработчик для события закрытия BottomSheet
            enablePanDownToClose={true}
            initialIndex={0} // Начальная позиция - 60%
            usePortal={false} // Используем Portal для отображения BottomSheet
          />
        )}
    </View>

  );
});

export default Feed;