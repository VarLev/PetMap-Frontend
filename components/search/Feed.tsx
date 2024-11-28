// Feed.tsx

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { FlatList, View, ActivityIndicator } from 'react-native';
import feedStore from '@/stores/FeedStore';
import PostItem from '@/components/search/PostItem';
import CreatePost from '@/components/search/CreatePost';

const Feed: React.FC = observer(() => {
  const { posts, loading, fetchPosts, incrementPage, resetPage } = feedStore;

  useEffect(() => {
    resetPage();
    fetchPosts();
  }, []);

  const loadMorePosts = () => {
    incrementPage();
    fetchPosts();
  };

  return (
    <View >
      <FlatList
        ListHeaderComponent={<CreatePost />}
        data={posts}
        keyExtractor={(post) => post.id.toString()}
        renderItem={({ item }) => <PostItem post={item} />}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      />
    </View>
  );
});

export default Feed;