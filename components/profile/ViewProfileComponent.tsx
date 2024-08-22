import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View,Image, StatusBar, StyleSheet  } from 'react-native';
import { Text, Card, Divider, IconButton, Menu, Button, PaperProvider } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import BottomSheetComponent from '../common/BottomSheetComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomTextComponent from '../custom/text/CustomTextComponent';
import { INTEREST_TAGS } from '@/constants/Strings';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';


const ViewProfileComponent = observer(({ onEdit }: { onEdit: () => void }) => {
  const user = userStore.currentUser!;
  const sheetRef = useRef<BottomSheet>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    sheetRef.current?.expand();

  }, []);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  function handleChange(arg0: string, selectedTags: string[]): void {
    throw new Error('Function not implemented.');
  }

  return (
    <GestureHandlerRootView className='h-full'>
      <PaperProvider>
        <View style={{ alignItems: 'center'}}>
          <StatusBar  backgroundColor="transparent" translucent />
          <View className="relative w-full aspect-square">
            <Image source={{ uri: user?.thumbnailUrl! }} className="w-full h-full" />
            <View style={styles.iconContainer}>
              <Menu 
                style={{marginTop: 25}}
                visible={menuVisible}
                onDismiss={closeMenu}
                contentStyle={{ backgroundColor: 'white' }}
                anchor={
                  <IconButton
                    icon="menu"
                    size={30}
                    iconColor="black"
                    style={styles.menuButton}
                    onPress={openMenu}
                  />
                }
              >
                <Menu.Item onPress={onEdit} title="Редактировать" rippleColor='black' titleStyle={{color:'balck'}} leadingIcon='pen'/>
                <Menu.Item onPress={closeMenu} title="Выйти" titleStyle={{color:'balck'}} leadingIcon='exit-to-app'/>
                <Menu.Item onPress={closeMenu} title="Удалить аккаунт" titleStyle={{color:'balck'}} leadingIcon='delete'/>
              </Menu>
            </View>
          </View>
        </View>
      </PaperProvider>
      <BottomSheetComponent ref={sheetRef} enablePanDownToClose={false} snapPoints={['60%','100%']} renderContent={function (): React.ReactNode {
        return ( 
        <View className='bg-white h-full'>
          <Text className='pl-5 text-2xl font-nunitoSansBold'>
            {user.name}, {user.age}
          </Text>
          <Card className="h-56 m-4 p-4 border-dashed rounded-2xl shadow-lg items-center justify-center" style={{ borderWidth: 3, borderColor: '#D9CBFF'}}>
            <TouchableOpacity className="items-center">
              <IconButton
                icon="plus"
                size={30}
                iconColor="black"
                className="bg-[#F5ECFF] rounded-full"
              />
              <Text className="text-base text-black font-nunitoSansRegular">Добавить питомца</Text>
            </TouchableOpacity>
          </Card>
          <View className='pr-3 pl-4'>
            <View >
              <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Обо мне</Text>
              <CustomTextComponent text={user.description}  rightIcon='chevron-right' onRightIconPress={onEdit}/>
              <Divider />
            </View>
            <View >
              <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Интересы</Text>
              <CustomTagsSelector 
                tags={user.interests || []} 
                initialSelectedTags={[]}
                onSelectedTagsChange={(selectedTags) => handleChange('interests', selectedTags)} 
                maxSelectableTags={5}
              />
              <Divider className='mt-3' />
            </View>
            <View>
              <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Основное</Text>
              <CustomTextComponent text={''} leftIcon='location-pin' iconSet='simpleLine' rightIcon='chevron-right' onRightIconPress={onEdit} />
              <CustomTextComponent text={user.userLanguages} leftIcon='language-outline' iconSet='ionicons' rightIcon='chevron-right' onRightIconPress={onEdit}/>
              <CustomTextComponent text={user.work} leftIcon='work-outline' rightIcon='chevron-right' onRightIconPress={onEdit} />
              <CustomTextComponent text={user.education} leftIcon='school-outline' iconSet='ionicons'  rightIcon='chevron-right'onRightIconPress={onEdit} />
              <Divider className='mt-3' />
            </View>
            <View>
              <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Социальные сети</Text>
              <CustomTextComponent text={''} leftIcon='instagram' iconSet='fontAwesome' rightIcon='chevron-right' onRightIconPress={onEdit}/>
              <CustomTextComponent text={''} leftIcon='facebook' iconSet='fontAwesome'  rightIcon='chevron-right' onRightIconPress={onEdit} />
              <Divider className='mt-3' />
            </View>
          </View>
          <View className='h-28'/>
        </View>)
      } }/>
    </GestureHandlerRootView>
  );
});

export default ViewProfileComponent;

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 8,
    right: 8,
  },
  menuButton: {
    backgroundColor: 'white',
  }
  
});