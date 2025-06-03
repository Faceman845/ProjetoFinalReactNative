import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileInput from './ProfileInput';

/**
 * Componente para o formulário de dados pessoais
 */
const PersonalDataForm = ({ 
  email,
  nome, setNome,
  cpf, setCpf,
  telefone, setTelefone
}) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Dados Pessoais</Text>
      
      <ProfileInput
        label="Email"
        value={email || ''}
        editable={false}
      />
      
      <ProfileInput
        label="Nome Completo"
        placeholder="Digite seu nome completo"
        value={nome}
        onChangeText={setNome}
      />
      
      <ProfileInput
        label="CPF"
        placeholder="000.000.000-00"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      
      <ProfileInput
        label="Telefone"
        placeholder="(00) 00000-0000"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
  },
});

export default PersonalDataForm;
