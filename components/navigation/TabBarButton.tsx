import React, { useEffect } from 'react';
import { Pressable, StyleSheet, PressableProps } from 'react-native';
import { iconsTab } from '@/constants/Icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


interface TabBarButtonProps extends PressableProps {
    isFocused: boolean;
    label: string;
    routeName: string;
    color: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({ isFocused, label, routeName, color, ...props }) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
    }, [scale, isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
        const top = interpolate(scale.value, [0, 1], [0, 8]);

        return {
            transform: [{ scale: scaleValue }],
            top,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);

        return {
            opacity,
        };
    });

    return (
        <Pressable {...props} style={styles.container}>
            <Animated.View style={animatedIconStyle}>
                {iconsTab[routeName]({ color })}
            </Animated.View>
            <Animated.Text style={[{ color, fontSize: 11 }, animatedTextStyle]}>
                {label}
            </Animated.Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
});

export default TabBarButton;
