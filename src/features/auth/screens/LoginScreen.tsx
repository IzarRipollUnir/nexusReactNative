import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../shared/contexts/AuthContext';

type LoginScreenProps = {
  navigation: {
    goBack: () => void;
    canGoBack: () => boolean;
  };
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    try {
      await signIn(email, password);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Login failed', String(err) || 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, justifyContent: 'center' }} edges={["top", "bottom"]}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Login</Text>
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ borderWidth: 1, marginVertical: 8, padding: 8, borderRadius: 4 }}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 8, padding: 8, borderRadius: 4 }}
      />
      <Button title="Sign in" onPress={handleLogin} />
    </SafeAreaView>
  );
}
