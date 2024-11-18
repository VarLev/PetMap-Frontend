import { View, StyleSheet } from 'react-native';
import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react-lite';
import TabBarButton from './TabBarButton';
import { Colors } from '@/constants/Colors';
import { useDrawer } from '@/contexts/DrawerProvider';
import SidebarUserProfileComponent from './SidebarUserProfileComponent';

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const primaryColor = Colors.light.primTextButtHigh;
  const { openDrawer } = useDrawer();
 

  return (
   
    <View style={styles.tabbar} className='shadow-md shadow-black'>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = async () => {
          if (route.name === 'profile') {
            await openDrawer(<SidebarUserProfileComponent/>); // Открыть Drawer при нажатии на "Profile"
          } else {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : 'black'}
            label={label.toString()}
          />
        );
      })}
    </View>
   
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 10 ,
    paddingVertical: 10,
    borderRadius: 25,
    // shadowColor: 'black',
    // shadowOffset: { width: 10, height: 10 },
    // shadowRadius: 100,
    // shadowOpacity: 1,
  },
});

export default observer(TabBar);
