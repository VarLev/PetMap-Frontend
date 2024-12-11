import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, TextStyle, View } from 'react-native';
import { Text } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import { useRoute } from '@react-navigation/native';

const ArticleView: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { title, articleUrl } = route.params as { title: string; articleUrl: string };

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(articleUrl as string);
        const content = await response.text();
        setMarkdownContent(content);
      } catch (error) {
        console.error("Ошибка загрузки статьи:", error);
      } finally {
        setLoading(false);
      }
    };

    if (articleUrl) {
      fetchMarkdown();
    }
  }, [articleUrl]);

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  const markdownStyles = {
    body: {
      fontFamily: 'NunitoSans_400Regular',
      fontSize: 16,
      lineHeight: 24,
      color: '#333',
    } as TextStyle,
    heading1: {
      fontFamily: 'NunitoSans_700Bold',
      fontSize: 22,
      marginVertical: 8,
      color: '#000',
    } as TextStyle,
    heading2: {
      fontFamily: 'NunitoSans_700Bold',
      fontSize: 20,
      marginVertical: 6,
      color: '#000',
    } as TextStyle,
    heading3: {
      fontFamily: 'NunitoSans_700Bold',
      fontSize: 20,
      marginVertical: 4,
      color: '#000',
    } as TextStyle,
    heading4: {
      fontFamily: 'NunitoSans_700Bold',
      fontSize: 18,
      marginVertical: 4,
      color: '#000',
    } as TextStyle,
    paragraph: {
      fontFamily: 'NunitoSans_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginVertical: 4,
      color: '#333',
    } as TextStyle,
    strong: {
      fontFamily: 'NunitoSans_700Bold',
      color: '#000',
    } as TextStyle,
    em: {
      fontFamily: 'NunitoSans_400Regular',
      fontStyle: 'italic' as 'italic',
    } as TextStyle,
    list_item: {
      fontFamily: 'NunitoSans_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginVertical: 4,
    } as TextStyle,
    bullet_list: {
      fontFamily: 'NunitoSans_400Regular',
      fontSize: 16,
      lineHeight: 24,
    } as TextStyle,
    ordered_list: {
      fontFamily: 'NunitoSans_400Regular',
      fontSize: 16,
      lineHeight: 24,
    } as TextStyle,
    blockquote: {
      fontFamily: 'NunitoSans_400Regular',
      fontSize: 16,
      lineHeight: 24,
      color: '#555',
      paddingLeft: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#ccc',
      marginVertical: 8,
    } as TextStyle,
    code_inline: {
      fontFamily: 'NunitoSans_400Regular',
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    } as TextStyle,
    code_block: {
      fontFamily: 'NunitoSans_400Regular',
      backgroundColor: '#f0f0f0',
      padding: 8,
      borderRadius: 6,
      marginVertical: 8,
    } as TextStyle,
    link: {
      fontFamily: 'NunitoSans_400Regular',
      color: '#1e90ff',
      textDecorationLine: 'underline',
    } as TextStyle,
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#fff' }}>
      <Text variant="titleLarge" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {title}
      </Text>
      {markdownContent ? (              
        <Markdown style={markdownStyles} >{markdownContent}</Markdown>
      ) : (
        <Text>Статья не найдена.</Text>
      )}
      <View className='h-20'/>
    </ScrollView>
  );
};

export default ArticleView;
