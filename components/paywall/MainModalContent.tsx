import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { View } from 'react-native';
import { FC, ReactNode } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

type MainModalContentProps = {
    children: ReactNode;
}

// Общее «тело» модалки
const MainModalContent: FC<MainModalContentProps> = ({children}) => (
    <View className='h-full'>
      {/* Градиент */}
        <Svg height="100%" width="100%" className="absolute">
            <Defs>
                <RadialGradient
                    id="grad"
                    cx="10.38%"
                    cy="0.32%"
                    rx="99.68%"
                    ry="99.68%"
                    fx="10.38%"
                    fy="0.32%"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0%" stopColor="#BC88FF" />
                    <Stop offset="100%" stopColor="#2F00B6" />
                </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
        {/* Контент экрана внутри ScrollView, чтобы всё прокручивалось на мелких экранах */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 40, paddingBottom: 20 }}>
            {children}
        </ScrollView>
    </View>
);

export default MainModalContent