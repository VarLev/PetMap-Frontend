import { View, ScrollView, Alert} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  TextInput, Text, Checkbox } from 'react-native-paper';
import { Link, router } from 'expo-router';

import userStore from '@/stores/UserStore';
import CustomButtonPrimary from '@/components/custom/buttons/CustomButtonPrimary';



const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  //const { setLoading, setLogged, setCreatedUser } = useStore();


  const handleRegister = async () => {

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      await userStore.registerUser(email, password);
      
      Alert.alert('Success', 'Account created successfully! A verification email has been sent to your email address. Please check your inbox and verify your email to complete the registration.');
      router.replace('/onboarding');
    } catch (error: any) {
      Alert.alert('Registration Error', error.message.replace('Firebase:', ''));
    }
  };

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  }
  
  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView>
        <View className=' w-full justify-center h-full px-9 my-20 '>
          <View className='flex-col items-start justify-center '>
            <Text variant='titleSmall' className='text-lg font-nunitoSansBold'>Станьте частью PetMap!</Text>
            <Text variant='titleSmall' className='mb-4 text-sm font-nunitoSansRegular'>Введите данные, чтобы создать аккаунт.</Text>
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
     
        <TextInput
          mode='outlined'
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
           className='mb-2'
        />
        <View className='flex-row items-center justify-center gap-3'>
          <Checkbox status={'checked'} onPress={() => {}} color='#3730a3'/>
          <Text variant='titleSmall' className='mb-4 p-2 font-nunitoSansRegular text-xs'>Я согласен с Политикой обработки данных сервиса</Text>
        </View>
        
        <CustomButtonPrimary 
                title='Зарегистрироваться' 
                handlePress={handleRegister} 
                containerStyles='w-full' 
              />        
      
        <View className='justify-center pt-5 flex-row gap-2'>        
          <Text className='text-base text-gray-500 font-nunitoSansRegular'>У вас уже есть аккаунт,</Text>
          <Link href='/sign-in' className='text-base text-indigo-800 font-nunitoSansBold'>Войти!</Link>
        </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp