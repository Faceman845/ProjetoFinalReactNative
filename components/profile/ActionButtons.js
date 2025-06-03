import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Componente para os botões de ação na tela de perfil
 */
const ActionButtons = ({ onSave, onClear }) => {
  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Salvar Dados</Text>
      </TouchableOpacity>
      
      <View style={styles.spacing} />
      
      <TouchableOpacity 
        style={styles.clearButton} 
        onPress={onClear}
        activeOpacity={0.7}
      >
        <Text style={styles.clearButtonText}>Limpar Informações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  spacing: {
    height: 10,
  },
  clearButton: {
    backgroundColor: '#ff9500',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ActionButtons;
