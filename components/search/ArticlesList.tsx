import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  Linking,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Banner, Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getFileUrl, getFoldersInDirectory } from '@/firebaseConfig';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import { BG_COLORS } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Article {
  title: string;
  mainImageUrl: string;
  articleUrl: string;
}

const ArticlesList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Показывает/скрывает баннер в целом
  const [bannerVisible, setBannerVisible] = useState(true);


  const navigation = useNavigation();

  // Загрузка статей
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

  // Функция для открытия почтового приложения
  const handleOpenEmail = () => {
    Linking.openURL('mailto:info@petmap.app?subject=Quiero%20ser%20autor');
  };

  // Обработчик прокрутки списка
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    // Если пользователь проскроллил вниз (offsetY > 0) — скрываем баннер,
    // если вернулись на самую верхушку (offsetY === 0) — показываем баннер.
    setBannerVisible(offsetY === 0);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Баннер в верхней части экрана */}
      <Banner className='bg-violet-200'
      
        visible={bannerVisible}
        icon={({ size, color }) => (
          <MaterialCommunityIcons
            name="gmail"
            size={size}
            color={BG_COLORS.indigo[800]} // указываем нужный цвет
          />
        )}
        style={{ marginTop: -5}}
        contentStyle={{ marginVertical: 0 }}
        
        actions={[
          {
            label: 'Стать автором',
            onPress: () => handleOpenEmail(),
            textColor: BG_COLORS.indigo[800],
            labelStyle: { fontFamily: 'NunitoSans_700Bold' },
            style: { marginTop: -20 },
          },
          {
            label: 'Закрыть',
            onPress: () => setBannerVisible(false),
            textColor: BG_COLORS.indigo[800],
            labelStyle: { fontFamily: 'NunitoSans_700Bold' },
            style: { marginTop: -20 },
          },
        ]}
      >
    
        
          <Text className='font-nunitoSansRegular' >
            Хотите публиковать статьи в нашем приложении? 
            Расскажите о себе и предложите темы, на которые вы хотите писать.
          </Text>
   
   
      </Banner>

      {/* Список статей */}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.title}
        onScroll={handleScroll}
        // Настройка scrollEventThrottle для более частых (или реже) событий скролла.
        // Можно увеличить значение для уменьшения количества вызовов handleScroll.
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Card style={{ marginHorizontal: 16, marginVertical: 4 }} mode="elevated">
            <Card.Cover
              source={{ uri: item.mainImageUrl }}
              resizeMode="contain"
              style={{ height: 150, backgroundColor: '#fff' }}
            />
            <Card.Content>
              <Text variant="titleLarge" style={{ marginVertical: 4, textAlign: 'center' }}>
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
        ListFooterComponent={<View style={{ height: 90 }} />}
      />
    </View>
  );
};

export default ArticlesList;
