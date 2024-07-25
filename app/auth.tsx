import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import OnboardingCarousel from '../components/auth/OnboardingCarousel';
import AuthForm from '../components/auth/AuthForm';

const AuthScreen = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleShowAuthForm = (isRegistering: boolean) => {
    setIsRegistering(isRegistering);
    setShowAuthForm(true);
  };

  const handleBackToButtons = () => {
    setShowAuthForm(false);
  };

  return (
    <View style={styles.container}>
      {!showAuthForm ? (
        <>
          <View style={{ flex: 5 }}>
            <OnboardingCarousel />
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => handleShowAuthForm(true)} style={styles.button}>
              Get Started
            </Button>
            <Button mode="outlined" onPress={() => handleShowAuthForm(false)} style={styles.button}>
              Log In
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.authFormContainer}>
          <AuthForm isRegistering={isRegistering} onSwitchMode={handleBackToButtons} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  authFormContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    marginVertical: 10,
    borderRadius: 30,
    height: 50,
    width: '80%',
  },
});

export default AuthScreen;
