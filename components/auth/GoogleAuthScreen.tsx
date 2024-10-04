import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useStore } from '../../stores/RootStore';
import { Button } from 'react-native-paper';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your actual web client ID
});

const GoogleAuthScreen = observer(() => {
  const { userStore } = useStore();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: 'YOUR_WEB_CLIENT_ID',
      offlineAccess: true,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo;
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(userStore.auth, credential);
      userStore.setUser(userCredential.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google Sign In cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google Sign In in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('Play services not available or outdated');
      } else {
        console.error('Google Sign In Error:', error);
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-5">Войти с помощью Google</Text>
      <Button
        icon="google"
        mode="contained"
        className="bg-blue-500"
        onPress={handleGoogleSignIn}
      >
        Войти через Google
      </Button>
    </View>
  );
});

export default GoogleAuthScreen;