import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function UserProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  
  // Estados para os campos do perfil
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados do usuário quando a tela é montada
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'usuarios', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setNome(userData.nome || '');
            setCpf(userData.cpf || '');
            setTelefone(userData.telefone || '');
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          Alert.alert('Erro', 'Não foi possível carregar seus dados. Tente novamente mais tarde.');
        }
      }
      setIsLoading(false);
    };

    carregarDadosUsuario();
  }, [user]);

  // Função para salvar os dados do perfil
  const salvarPerfil = async () => {
    try {
      const userDocRef = doc(db, 'usuarios', user.uid);
      await setDoc(userDocRef, {
        nome,
        cpf,
        telefone,
        email: user.email,
        ultimaAtualizacao: new Date()
      }, { merge: true });
      
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar seus dados. Tente novamente mais tarde.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Meu Perfil</Text>
        
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={user?.email || ''}
          editable={false}
        />
        
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          value={nome}
          onChangeText={setNome}
        />
        
        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={14}
        />
        
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <TouchableOpacity style={styles.saveButton} onPress={salvarPerfil}>
          <Text style={styles.saveButtonText}>Salvar Dados</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
