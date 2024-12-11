// PostNewsItem.tsx
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { useWindowDimensions } from 'react-native';
import { Card } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';

interface PostNewsItemProps {
  news: string;
}

const PostNewsItem: FC<PostNewsItemProps> = observer(({ news='' }) => {
  const { width } = useWindowDimensions();
  return (
      <Card className="mx-2 mt-2 bg-white rounded-2xl">
        <Card.Content>
          <RenderHTML
            contentWidth={width - 20}// Укажите ширину контента
            source={{ html: news }} // Передача HTML-контента
            tagsStyles={{
              p: { fontSize: 16, color: '#333', lineHeight: 20 },
              h2: { fontSize: 50, color: '#2F00B6', marginVertical: 6 },
            }}
          />
        </Card.Content>
      </Card>
  );
});


export default PostNewsItem;
