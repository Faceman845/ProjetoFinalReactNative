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
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

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
    const carregarDadosUsuario = async () => {
      // Verifica se o usuário está autenticado
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
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

    carregarDadosUsuario();
  }, [user]);

  // Função para buscar endereço pelo CEP usando a API ViaCEP
  const buscarCep = async () => {
    if (cep.length !== 8) {
      Alert.alert('CEP Inválido', 'Por favor, digite um CEP válido com 8 dígitos');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        Alert.alert('CEP não encontrado', 'O CEP informado não foi encontrado');
        return;
      }
      
      setEndereco(data.logradouro || '');
      setBairro(data.bairro || '');
      setCidade(data.localidade || '');
      setEstado(data.uf || '');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      Alert.alert('Erro', 'Não foi possível buscar o CEP. Verifique sua conexão.');
    }
  };

  // Função para salvar os dados do perfil
  const salvarPerfil = async () => {
    // Verifica se o usuário está autenticado
    if (!user?.uid) {
      Alert.alert('Erro de Autenticação', 'Você precisa estar logado para salvar seu perfil');
      return;
    }
    
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, preencha seu nome');
      return;
    }

    try {
      const userDocRef = doc(db, 'usuarios', user.uid);
      await setDoc(userDocRef, {
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
        email: user.email,
        ultimaAtualizacao: new Date()
      }, { merge: true });
      
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar seus dados. Tente novamente mais tarde.');
    }
  };

  // Função para formatar CPF enquanto digita
  const formatarCpf = (texto) => {
    const cpfLimpo = texto.replace(/\D/g, '');
    
    if (cpfLimpo.length <= 11) {
      let cpfFormatado = cpfLimpo;
      
      if (cpfLimpo.length > 3) {
        cpfFormatado = cpfLimpo.replace(/^(\d{3})(\d)/, '$1.$2');
      }
      if (cpfLimpo.length > 6) {
        cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      }
      if (cpfLimpo.length > 9) {
        cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
      }
      
      setCpf(cpfFormatado);
    }
  };

  // Função para formatar telefone enquanto digita
  const formatarTelefone = (texto) => {
    const telefoneLimpo = texto.replace(/\D/g, '');
    
    if (telefoneLimpo.length <= 11) {
      let telefoneFormatado = telefoneLimpo;
      
      if (telefoneLimpo.length > 2) {
        telefoneFormatado = telefoneLimpo.replace(/^(\d{2})(\d)/, '($1) $2');
      }
      if (telefoneLimpo.length > 6) {
        telefoneFormatado = telefoneFormatado.replace(/^(\(\d{2}\)\s)(\d{4,5})(\d)/, '$1$2-$3');
      }
      
      setTelefone(telefoneFormatado);
    }
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
              
              // Verificar se o documento existe antes de tentar excluí-lo
              const userDocRef = doc(db, 'usuarios', user.uid);
              const docSnap = await getDoc(userDocRef);
              
              if (docSnap.exists()) {
                console.log('Documento encontrado, iniciando exclusão...');
                await deleteDoc(userDocRef);
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
        
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, {backgroundColor: '#eee'}]}
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
          placeholder="000.000.000-00"
          value={cpf}
          onChangeText={formatarCpf}
          keyboardType="numeric"
          maxLength={14}
        />
        
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 00000-0000"
          value={telefone}
          onChangeText={formatarTelefone}
          keyboardType="phone-pad"
          maxLength={15}
        />
        
        <Text style={styles.sectionTitle}>Endereço</Text>
        
        <View style={styles.cepContainer}>
          <View style={styles.cepInputContainer}>
            <Text style={styles.label}>CEP</Text>
            <TextInput
              style={styles.input}
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
        
        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Rua, Avenida, etc."
          value={endereco}
          onChangeText={setEndereco}
        />
        
        <View style={styles.rowContainer}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              placeholder="Nº"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.halfInput}>
            <Text style={styles.label}>Complemento</Text>
            <TextInput
              style={styles.input}
              placeholder="Apto, Bloco, etc."
              value={complemento}
              onChangeText={setComplemento}
            />
          </View>
        </View>
        
        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          placeholder="Bairro"
          value={bairro}
          onChangeText={setBairro}
        />
        
        <View style={styles.rowContainer}>
          <View style={styles.cityInput}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Cidade"
              value={cidade}
              onChangeText={setCidade}
            />
          </View>
          
          <View style={styles.stateInput}>
            <Text style={styles.label}>Estado</Text>
            <TextInput
              style={styles.input}
              placeholder="UF"
              value={estado}
              onChangeText={setEstado}
              maxLength={2}
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.saveButton} onPress={salvarPerfil}>
          <Text style={styles.saveButtonText}>Salvar Dados</Text>
        </TouchableOpacity>
        
        <View style={styles.spacing} />
        
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={limparInformacoes}
          activeOpacity={0.7}
        >
          <Text style={styles.clearButtonText}>Limpar Informações</Text>
        </TouchableOpacity>
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
