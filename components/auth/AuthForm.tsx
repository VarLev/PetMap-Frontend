import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/firebaseConfig';

interface AuthFormProps {
  isRegistering: boolean;
  onSwitchMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegistering, onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      await createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {isRegistering && (
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      )}
      {isRegistering ? (
        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Register
        </Button>
      ) : (
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Log In
        </Button>
      )}
      <Button mode="outlined" onPress={onSwitchMode} style={styles.button}>
        Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    width: '80%',
    height: 50,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 10,
    borderRadius: 30,
    height: 50,
    width: '80%',
  },
});

export default AuthForm;
