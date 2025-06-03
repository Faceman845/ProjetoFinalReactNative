import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Ionicons } from '@expo/vector-icons';

// --- IMAGENS ---
const logoSmallImage = require('../assets/party_shop_logo_small.png');


export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Exemplo de requisitos de senha
  const passwordRequirements = [
    "Mínimo de 6 caracteres",
    "Pelo menos uma letra maiúscula (A-Z)",
    "Pelo menos uma letra minúscula (a-z)",
    "Pelo menos um número (0-9)",
  ];

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    let NmrError = 0; // Número de erros para exibir uma mensagem
    let errorMessages = [];

    if (password.length < 6) { // Verifica se a senha tem pelo menos 6 caracteres
      errorMessages.push("A senha deve ter no mínimo 6 caracteres.");
      NmrError++;
    }
    if (!/[A-Z]/.test(password)) { // Verifica se a senha contém pelo menos uma letra maiúscula
      errorMessages.push("A senha deve conter pelo menos uma letra maiúscula.");
      NmrError++;
    }
    if (!/[a-z]/.test(password)) { // Verifica se a senha contém pelo menos uma letra minúscula
      errorMessages.push("A senha deve conter pelo menos uma letra minúscula.");
      NmrError++;
    }
    if (!/[0-9]/.test(password)) { // Verifica se a senha contém pelo menos um número
      errorMessages.push("A senha deve conter pelo menos um número.");
      NmrError++;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) { // Verifica se a senha contém pelo menos um caractere especial
      errorMessages.push("A senha deve conter pelo menos um caractere especial.");
      NmrError++;
    }

    if (NmrError > 0) {
      if (NmrError === 1) {
          alert(errorMessages.join("\n")); // Exibe apenas uma mensagem de erro se for um único requisito
      } else {
          alert(`Sua senha não atende aos seguintes ${NmrError > 1 ? NmrError + ' requisitos' : 'requisito'}:\n\n- ` + errorMessages.join("\n- "));
      }
      return;
    }
    
    setIsLoading(true);
    try { 
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Cadastro realizado com sucesso! Faça o login.');
      navigation.navigate('Login');
      } catch (error) {
      alert(error.message);
      }
      setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centeredActivity]}>
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text style={styles.loadingText}>Cadastrando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={logoSmallImage} style={styles.logo} resizeMode="contain" />
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Crie sua senha" 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        {/* Exibição dos requisitos de senha */}
         <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>A senha deve atender aos seguintes requisitos:</Text>
          {passwordRequirements.map((requirement, index) => (
            <View key={index} style={styles.requirementItem}>
              <Ionicons name="ellipse-outline" size={14} color="#555" style={styles.requirementIcon} />
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.label}>Confirme a senha</Text>
        <TextInput
          placeholder="Repita a senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.buttonOutlined]} onPress={() => navigation.goBack()}>
          <Text style={[styles.buttonText, styles.buttonTextOutlined]}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonFilled]} onPress={handleRegister}>
          <Text style={[styles.buttonText, styles.buttonTextFilled]}>Avançar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



// Estilos adaptados do LoginScreen, com ajustes para a tela de Cadastro
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
  logo: { 
    width: 160,
    height: 80,
    marginBottom: 10,
  },
  inputGroup: { 
    width: '100%',
    backgroundColor: '#E0F7FA',
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
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
    paddingVertical: 12,
    marginBottom: 18,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%', 
    marginBottom: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '48%', 
    elevation: 2,
  },
  buttonFilled: {
    backgroundColor: '#00BCD4',
  },
  buttonOutlined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#00BCD4',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonTextFilled: {
    color: '#FFFFFF',
  },
  buttonTextOutlined: {
    color: '#00BCD4',
  },
});