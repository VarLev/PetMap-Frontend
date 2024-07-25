import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import OnboardingCarousel from '../components/auth/OnboardingCarousel';

const AuthScreen = () => {
  const handleLogin = () => {
    // Логика входа через логин и пароль
  };

  const handleGoogleLogin = () => {
    // Логика входа через Google
  };

  return (
    <View style={styles.container}>
      <View style={{flex:5}}>
        <OnboardingCarousel />
      </View>
     
      <View style={styles.buttonContainer}>
        
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Войти через логин и пароль
        </Button>
        <Button mode="contained" onPress={handleGoogleLogin} style={styles.button}>
          Войти через Google
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  buttonContainer: {
    flex:1,
    marginTop: 20,
    width: '100%'
  },
  button: {
    marginVertical: 10,
    borderRadius: 30,
    height: 50,
  }
});

export default AuthScreen;
