import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProfileInput from './ProfileInput';

/**
 * Componente para o formulário de endereço
 */
const AddressForm = ({ 
  cep, setCep,
  endereco, setEndereco,
  numero, setNumero,
  complemento, setComplemento,
  bairro, setBairro,
  cidade, setCidade,
  estado, setEstado,
  buscarCep
}) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Endereço</Text>
      
      <View style={styles.rowContainer}>
        <View style={styles.cepInputContainer}>
          <ProfileInput
            label="CEP"
            placeholder="00000-000"
            value={cep}
            onChangeText={setCep}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
        <TouchableOpacity style={styles.cepButton} onPress={buscarCep}>
          <Text style={styles.cepButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      
      <ProfileInput
        label="Endereço"
        placeholder="Rua, Avenida, etc."
        value={endereco}
        onChangeText={setEndereco}
      />
      
      <View style={styles.rowContainer}>
        <View style={styles.halfInput}>
          <ProfileInput
            label="Número"
            placeholder="Nº"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.halfInput}>
          <ProfileInput
            label="Complemento"
            placeholder="Apto, Bloco, etc."
            value={complemento}
            onChangeText={setComplemento}
          />
        </View>
      </View>
      
      <ProfileInput
        label="Bairro"
        placeholder="Bairro"
        value={bairro}
        onChangeText={setBairro}
      />
      
      <View style={styles.rowContainer}>
        <View style={styles.cityInput}>
          <ProfileInput
            label="Cidade"
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
          />
        </View>
        
        <View style={styles.stateInput}>
          <ProfileInput
            label="Estado"
            placeholder="UF"
            value={estado}
            onChangeText={setEstado}
            maxLength={2}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cepInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  cepButton: {
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-end',
    height: 45,
    marginBottom: 15,
  },
  cepButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  halfInput: {
    width: '48%',
  },
  cityInput: {
    width: '75%',
  },
  stateInput: {
    width: '20%',
  },
});

export default AddressForm;
