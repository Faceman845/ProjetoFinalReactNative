import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { signInWithEmailAndPassword, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider, signInWithCredential, GoogleSignin, statusCodes } from '../services/firebase';

// --- IMAGENS ---
const logoImage = require('../assets/party_shop_logo.png'); // Ex: Seu logo principal
const googleIconImage = require('../assets/google_icon.png'); // Ex: Ícone do Google

// Configuração do Google Sign-In
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  GoogleSignin.configure({
    webClientId: '600857194384-qie10saobtisk7vkdjh52i9i2lsfcele.apps.googleusercontent.com',
  });
}


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já está logado
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Usuário já logado, navega para a tela principal
        navigation.navigate('Catalogo');
      }
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribe();
  }
  , [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha email e senha.');
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navegação é gerenciada pelo AuthContext e Routes.js
    } catch (error) {
      alert(error.message);
    }
    setIsLoading(false);
  };

  // Não consegui de jeito algum fazer o login com o Google funcionar no Expo Go, vendi minha alma pra 5 demonios mas não funcionou, então deixei apenas a lógica para Web e Nativo (iOS/Android).
 const handleGoogleLogin = async () => {
  setIsLoading(true);
  if (Platform.OS === 'web') {
    // Lógica para Web
    try {
      await signInWithPopup(auth, googleProvider);
      // alert('Login com Google (Web) realizado com sucesso!');
    } catch (error) {
      alert('Erro no login com Google (Web): ' + error.message);
      console.error("Erro no login com Google (Web):", error);
    }
  } else {
    // Lógica para Nativo (iOS/Android)
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
      // alert('Login com Google (Nativo) realizado com sucesso!');
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // alert('Login com Google cancelado.');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // alert('Login com Google em progresso.');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          alert('Google Play Services não disponível ou desatualizado.');
        } else {
          alert('Erro no login com Google (Nativo): ' + error.message);
          console.error("Erro no login com Google (Nativo):", error);
        }
      }
    }
  setIsLoading(false);
  }

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      console.log("Usuário logado anonimamente");
      // Navegação é gerenciada pelo AuthContext e Routes.js
    } catch (error) {
      console.error("Erro no login anônimo:", error);
      alert('Erro ao tentar login anônimo: ' + error.message);
    }
    setIsLoading(false);
  };

   const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);

    } catch (error) {
      alert(error.message);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centeredActivity]}>
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text style={styles.loadingText}>Entrando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      { <Image source={logoImage} style={styles.logo} resizeMode="contain" /> }

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          placeholder="email@algumacoisa.com"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          placeholder="Sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
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

      <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleButtonContainer}>
        { <Image source={googleIconImage} style={styles.googleIcon} resizeMode="contain" /> }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  centeredActivity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  logo: { // Estilo para a imagem do logo
    width: 300,
    height: 300,
  
  },
  logoText: { // Placeholder de texto para o logo
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FF69B4', // Cor vibrante, ajuste conforme seu logo
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'Roboto-Bold', // Exemplo de fonte
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 2
  },
  inputGroup: {
    width: '100%',
    backgroundColor: '#E0F7FA', // Azul claro, como no Figma
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#00BCD4', // Azul mais escuro da borda
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: '#00796B', // Cor do label
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B2DFDB', // Borda suave para o input
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 18,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  buttonPrimary: {
    backgroundColor: '#00BCD4', // Azul principal
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
    marginBottom: 12,
    elevation: 3,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#B2EBF2', // Azul mais claro para botões secundários
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#00BCD4',
  },
  buttonTextSecondary: {
    color: '#00796B', // Texto mais escuro para contraste
    fontSize: 17,
    fontWeight: 'bold',
  },
  googleButtonContainer: {
    marginTop: 20,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  googleIcon: { // Estilo para a imagem do ícone do Google
    width: 30,
    height: 30,
  },
  googleIconText: { // Placeholder de texto para o ícone do Google
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DB4437', // Cor aproximada do 'G' do Google
  }
});