// Feed.tsx
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { FlatList, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import feedStore from '@/stores/FeedStore';
import PostItem from '@/components/search/feed/PostItem';
import CreatePost from '@/components/search/feed/CreatePost';
import BottomSheetComponent from '@/components/common/BottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import { FAB } from 'react-native-paper';

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
    sheetRef.current?.close();
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
    <View className='flex-1' >
      <FlatList
        ListHeaderComponent={
          feedStore.posts.length === 0 ? (
            <View className='items-center content-center justify-center pt-52' style={{ alignItems: 'center' }}>
              <Text>Нет постов</Text>
              <Text>Создайте первый!</Text>
            </View>
          ) : null
        }
        data={feedStore.posts}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return <PostItem post={item} />;
        }}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={feedStore.loading ? <ActivityIndicator size="large" /> : <View className='h-20' />}
      />
      <FAB icon="pen" size='small' className='bg-violet-200' style={styles.fab} onPress={handleCreatePost}/>
      {isSheetVisible && (
        <BottomSheetComponent
          ref={sheetRef}
          snapPoints={['60%', '100%']}
          renderContent={<CreatePost onClose={handleSheetClose}/>}
          onClose={handleSheetClose} // Обработчик для события закрытия BottomSheet
          enablePanDownToClose={true}
          initialIndex={0} // Начальная позиция - 60%
          usePortal={false} // Используем Portal для отображения BottomSheet
        />
      )}
         
    </View>

  );
});

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
  },
})

export default Feed;