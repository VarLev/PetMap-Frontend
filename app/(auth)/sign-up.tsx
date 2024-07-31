import { View, ScrollView, Alert, Image} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput,Text } from 'react-native-paper';
import { Link, router } from 'expo-router';
import Images from '@/constants/Images';
//import { useStore } from '@/contexts/StoreProvider';
import userStore from '@/stores/UserStore';



const SignUp = () => {
  const [email, setEmail] = useState('levromf@gmail.com');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');
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
      router.push("/onboarding");
    } catch (error: any) {
      Alert.alert('Registration Error', error.message.replace('Firebase:', ''));
    }
  };

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  }
  
  return (
    <SafeAreaView className='bg-violet-100 h-full'>
      <ScrollView>
        <View className=' w-full justify-center h-full  px-9 my-20'>
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
     
        <TextInput
          mode='outlined'
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
           className='mb-2'
        />
        <Button mode="contained" onPress={handleRegister} className='mt-4'>Sign-Up</Button>
        <View className='justify-center pt-5 flex-row gap-2'>        
          <Text className='text-lg text-gray-500 font-pregular'>Already have account?</Text>
          <Link href='/sign-in' className='text-lg text-violet-900 font-pbold'>Sign In!</Link>
        </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp