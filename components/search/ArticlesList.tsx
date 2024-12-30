import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { getFileUrl, getFoldersInDirectory } from '@/firebaseConfig';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import { useNavigation } from '@react-navigation/native';

interface Article {
  title: string;
  mainImageUrl: string;
  articleUrl: string;
}

const ArticlesList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const folderList = await getFoldersInDirectory('WIKI/articles');

        const articleData = await Promise.all(
          folderList.map(async (folder) => {
            const title = folder.name;
            const mainImageUrl = await getFileUrl(`${folder.fullPath}/main.png`);
            const articleUrl = await getFileUrl(`${folder.fullPath}/article.md`);

            return { title, mainImageUrl, articleUrl };
          })
        );

        setArticles(articleData);
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  return (
    <FlatList
      className="h-full mb-10"
      data={articles}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <Card className="mx-4 my-1 bg-white rounded-3xl shadow-sm">
          <Card.Cover source={{ uri: item.mainImageUrl }} resizeMode='contain' className="h-38 bg-white" />
          <Card.Content>
            <Text variant="titleLarge" className="text-base self-center text-justify mt-0">
              {item.title}
            </Text>
          </Card.Content>
          <Card.Actions>
            <CustomButtonOutlined
              title="Читать"
              containerStyles="w-full"
              handlePress={() =>
                // @ts-ignore
                navigation.navigate('articleView', {
                  title: item.title,
                  articleUrl: item.articleUrl,
                })
              }
            />
          </Card.Actions>
        </Card>
      )}
      ListFooterComponent={<View className='h-10' />}
    />
  );
};

export default ArticlesList;
