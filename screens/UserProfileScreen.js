import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

// Componentes
import PersonalDataForm from '../components/profile/PersonalDataForm';
import AddressForm from '../components/profile/AddressForm';
import ActionButtons from '../components/profile/ActionButtons';

// Helpers
import { formatarCpf, formatarTelefone, buscarEnderecoPorCep } from '../utils/formatHelpers';
import { carregarDadosUsuario, salvarDadosUsuario, excluirDadosUsuario } from '../utils/firestoreHelpers';

export default function UserProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  
  // Redirecionar para a tela de login se o usuário não estiver autenticado
  useEffect(() => {
    if (!user) {
      Alert.alert(
        "Acesso Restrito", 
        "Você precisa estar logado para acessar seu perfil.",
        [{ text: "OK", onPress: () => navigation.navigate('Home') }]
      );
    }
  }, [user, navigation]);
  
  // Estados para os campos do perfil
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados do usuário quando a tela é montada
  useEffect(() => {
    const loadUserData = async () => {
      // Verifica se o usuário está autenticado
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userData = await carregarDadosUsuario(user.uid);
        
        if (userData) {
          setNome(userData.nome || '');
          setCpf(userData.cpf || '');
          setTelefone(userData.telefone || '');
          setCep(userData.cep || '');
          setEndereco(userData.endereco || '');
          setNumero(userData.numero || '');
          setComplemento(userData.complemento || '');
          setBairro(userData.bairro || '');
          setCidade(userData.cidade || '');
          setEstado(userData.estado || '');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar seus dados. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);

  // Função para buscar endereço pelo CEP
  const buscarCep = async () => {
    if (cep.length < 8) {
      Alert.alert('CEP Inválido', 'Por favor, digite um CEP válido com 8 dígitos');
      return;
    }
    
    try {
      const enderecoDados = await buscarEnderecoPorCep(cep);
      setEndereco(enderecoDados.endereco || '');
      setBairro(enderecoDados.bairro || '');
      setCidade(enderecoDados.cidade || '');
      setEstado(enderecoDados.estado || '');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.');
    }
  };

  // Função para salvar os dados do perfil
  const salvarPerfil = async () => {
    if (!user?.uid) {
      Alert.alert('Erro de Autenticação', 'Você precisa estar logado para salvar seu perfil');
      return;
    }
    
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, preencha seu nome');
      return;
    }
    
    try {
      const userData = {
        nome,
        cpf,
        telefone,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        updatedAt: new Date()
      };
      
      await salvarDadosUsuario(user.uid, userData);
      Alert.alert('Sucesso', 'Seus dados foram salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar seus dados. Tente novamente mais tarde.');
    }
  };

  // Wrapper para formatar CPF enquanto digita
  const handleCpfChange = (texto) => {
    setCpf(formatarCpf(texto));
  };
  
  // Wrapper para formatar telefone enquanto digita
  const handleTelefoneChange = (texto) => {
    setTelefone(formatarTelefone(texto));
  };
  
  // Função para limpar as informações do perfil
  const limparInformacoes = async () => {
    // Verificar se o usuário está autenticado
    if (!user || !user.uid) {
      Alert.alert('Erro de Autenticação', 'Você precisa estar logado para limpar seu perfil');
      return;
    }
    
    console.log('Iniciando processo de limpeza de dados para o usuário:', user.uid);
    
    Alert.alert(
      "Limpar Informações",
      "Tem certeza que deseja limpar todas as suas informações de perfil? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpar", 
          style: "destructive",
          onPress: async () => {
            try {
              console.log('Usuário confirmou a limpeza de dados');
              
              // Tentar excluir os dados do usuário
              const excluido = await excluirDadosUsuario(user.uid);
              
              if (excluido) {
                console.log('Documento excluído com sucesso');
              } else {
                console.log('Documento não encontrado, nada para excluir');
              }
              
              // Limpar os estados locais
              setNome('');
              setCpf('');
              setTelefone('');
              setCep('');
              setEndereco('');
              setNumero('');
              setComplemento('');
              setBairro('');
              setCidade('');
              setEstado('');
              
              console.log('Estados locais limpos com sucesso');
              Alert.alert("Sucesso", "Suas informações foram removidas com sucesso.");
            } catch (error) {
              console.error('Erro ao limpar informações:', error);
              Alert.alert('Erro', 'Não foi possível limpar suas informações. Tente novamente mais tarde. Erro: ' + error.message);
            }
          } 
        }
      ]
    );
  };

  // Se o usuário não estiver autenticado, mostra mensagem e botão para voltar
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Acesso Restrito</Text>
        <Text style={styles.message}>Você precisa estar logado para acessar seu perfil.</Text>
        <TouchableOpacity 
          style={[styles.saveButton, {backgroundColor: '#4b7bec'}]} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.saveButtonText}>Voltar para Home</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Mostra indicador de carregamento enquanto busca os dados
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
        
        <PersonalDataForm 
          email={user?.email}
          nome={nome}
          setNome={setNome}
          cpf={cpf}
          setCpf={handleCpfChange}
          telefone={telefone}
          setTelefone={handleTelefoneChange}
        />
        
        <AddressForm 
          cep={cep}
          setCep={setCep}
          endereco={endereco}
          setEndereco={setEndereco}
          numero={numero}
          setNumero={setNumero}
          complemento={complemento}
          setComplemento={setComplemento}
          bairro={bairro}
          setBairro={setBairro}
          cidade={cidade}
          setCidade={setCidade}
          estado={estado}
          setEstado={setEstado}
          buscarCep={buscarCep}
        />
        
        <ActionButtons 
          onSave={salvarPerfil}
          onClear={limparInformacoes}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
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
    color: '#333',
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
  cepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  cepInputContainer: {
    flex: 3,
  },
  cepButton: {
    flex: 1,
    backgroundColor: '#4b7bec',
    padding: 12,
    borderRadius: 5,
    marginLeft: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cepButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  spacing: {
    height: 10,
  },
  clearButton: {
    backgroundColor: '#ff9500',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
