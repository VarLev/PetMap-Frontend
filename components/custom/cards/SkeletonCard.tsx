import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { BG_COLORS } from '@/constants/Colors';

const SkeletonCard: React.FC = () => {
  return (
    <ContentLoader
    speed={2}
    
    width={350}
    height={180}
    viewBox="0 0 400 160"
    backgroundColor="#f3f3f3"
    foregroundColor={BG_COLORS.indigo[200]}
  >
    {/* Скелетон для изображения */}
    <Rect x="0" y="0" rx="8" ry="8" width="100" height="100" />
    
    {/* Скелетон для заголовка и описания */}
    <Rect x="120" y="-8" rx="4" ry="4" width="120" height="24" />
    <Rect x="120" y="32" rx="4" ry="4" width="100" height="20" />
    <Rect x="120" y="64" rx="4" ry="4" width="200" height="16" />
    
    {/* Скелетон для кнопки */}
    <Rect x="0" y="120" rx="8" ry="8" width="100%" height="40" />
  </ContentLoader>
  );
};

export default SkeletonCard;
