import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';

const logoImage = require('../assets/party_shop_logo.png');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha email e senha.');
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
    setIsLoading(false);
  };

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      console.log("Usuário logado anonimamente");
    } catch (error) {
      console.error("Erro no login anônimo:", error);
      alert('Erro ao tentar login anônimo: ' + error.message);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.containerFixed, styles.centeredActivity]}>
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text style={styles.loadingText}>Entrando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentWrapper}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              placeholder="email@algumacoisa.com"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => { passwordInputRef.current?.focus(); }}
              blurOnSubmit={false}
            />
            <Text style={styles.label}>Senha:</Text>
            <TextInput
              ref={passwordInputRef}
              placeholder="Sua senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
            <Text style={styles.buttonTextPrimary}>Logar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.buttonTextSecondary}>Cadastrar-se</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={handleAnonymousLogin}>
            <Text style={styles.buttonTextSecondary}>Entrar anônimo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  containerFixed: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  centeredActivity: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  logo: {
    width: 225,
    height: 225,
  },
  inputGroup: {
    width: '100%',
    backgroundColor: '#E0F7FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00BCD4',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: '#00796B',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B2DFDB',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  buttonPrimary: {
    backgroundColor: '#00BCD4',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    elevation: 3,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#B2EBF2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00BCD4',
  },
  buttonTextSecondary: {
    color: '#00796B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});