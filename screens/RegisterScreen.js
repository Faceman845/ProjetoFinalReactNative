import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Ionicons } from '@expo/vector-icons';

const logoSmallImage = require('../assets/party_shop_logo_small.png');

export default function RegisterScreen({ navigation }) {
  // Estados para armazenar os dados do formulário
  // email, password e confirmPassword são usados para o registro do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados para verificar os requisitos da senha
  const [metLength, setMetLength] = useState(false);
  const [metUppercase, setMetUppercase] = useState(false);
  const [metLowercase, setMetLowercase] = useState(false);
  const [metNumber, setMetNumber] = useState(false);
  const [metSpecialChar, setMetSpecialChar] = useState(false);

  // Requisitos da senha
  // Cada requisito é verificado e armazenado em um estado separado
  const passwordRequirementsChecks = [
    { label: "Mínimo de 6 caracteres", met: metLength },
    { label: "Pelo menos uma letra maiúscula (A-Z)", met: metUppercase },
    { label: "Pelo menos uma letra minúscula (a-z)", met: metLowercase },
    { label: "Pelo menos um número (0-9)", met: metNumber },
    { label: "Pelo menos um caractere especial (ex: !@#$%)", met: metSpecialChar },
  ];
  
  // Função para validar a senha conforme os requisitos
  const validatePassword = (currentPassword) => {
    setMetLength(currentPassword.length >= 6);
    setMetUppercase(/[A-Z]/.test(currentPassword));
    setMetLowercase(/[a-z]/.test(currentPassword));
    setMetNumber(/[0-9]/.test(currentPassword));
    setMetSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(currentPassword));
  };

  // useEffect para validar a senha sempre que ela mudar
  // Isso garante que os requisitos sejam verificados em tempo real
  useEffect(() => {
    validatePassword(password);
  }, [password]);

  // Função para lidar com o registro do usuário
  // Verifica se todos os campos estão preenchidos e se a senha atende aos requisitos
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (!metLength || !metUppercase || !metLowercase || !metNumber || !metSpecialChar) {
      alert('Por favor, certifique-se de que a senha atende a todos os requisitos.');
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
         <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>A senha deve atender aos seguintes requisitos:</Text>
          {passwordRequirementsChecks.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <Ionicons 
                name={req.met ? "checkmark-circle" : "ellipse-outline"} 
                size={18}
                color={req.met ? "#4CAF50" : "#555"}
                style={styles.requirementIcon} 
              />
              <Text style={[styles.requirementText, req.met && styles.requirementMetText]}>
                {req.label}
              </Text>
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
  logo: { 
    width: 160,
    height: 80,
    marginTop: 10,
    marginBottom: 10,
  },
  inputGroup: { 
    width: '100%',
    maxWidth: 400,
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
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  requirementsContainer: {
    marginTop: 5, 
    marginBottom: 15, 
    paddingHorizontal: 0,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00796B', 
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#555', 
    flexShrink: 1,
  },
  requirementMetText: {
    color: '#4CAF50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
    maxWidth: 400,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextFilled: {
    color: '#FFFFFF',
  },
  buttonTextOutlined: {
    color: '#00BCD4',
  },
});