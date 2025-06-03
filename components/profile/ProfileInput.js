import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

/**
 * Componente para campo de entrada com label na tela de perfil
 */
const ProfileInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  editable = true, 
  keyboardType = 'default',
  maxLength,
  style
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          !editable && styles.disabledInput,
          style
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#eee',
    color: '#666',
  },
});

export default ProfileInput;
