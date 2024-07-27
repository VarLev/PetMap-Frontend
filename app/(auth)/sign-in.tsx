import { View,ScrollView, Alert,Image} from 'react-native'
import { Text } from 'react-native-paper';
import { Button, TextInput } from 'react-native-paper'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import { signInWithEmailAndPassword } from '@/firebaseConfig'
import Images from '@/constants/Images';
import { useStore } from '@/contexts/StoreProvider';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  const { setLoading, setLogged, setLoginedUser } = useStore();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCred = await signInWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Logged in successfully!');
      setLoginedUser(userCred);
      setLogged(true);
      router.push("/onboarding");
      setLoading(false);
    } catch (error: any) {
      Alert.alert('Login Error', error.message.replace('Firebase:', ''));
    }
  };


  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  }
  
  return (
    <SafeAreaView className='bg-violet-100 h-full'>
    <ScrollView>
      <View className='w-full justify-center h-full  px-9 my-20'>
        <View className='-ml-4 flex-row items-start justify-center '>
          <Image source={Images.logo} className='w-[80px] h-[60px]' resizeMode='center'/>
          <Text variant='titleSmall' className='-ml-4 text-4xl font-pblack mt-4 text-violet-900'>PetMap</Text>
        </View>  
        <TextInput
        mode='outlined'
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className='mb-2'
        />
        <TextInput
          mode='outlined'
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={isSecure}
          className='mb-2'
          right={<TextInput.Icon icon="eye" onPress={handleToggleSecure} />}
        />
    
        <Button mode="contained" onPress={handleLogin} className='mt-4'>Sign-In</Button>
        <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-lg text-gray-500 font-pregular'>Don't have account?</Text>
          <Link href='/sign-up' className='text-lg text-violet-900 font-pbold'>Sign Up!</Link>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default SignIn