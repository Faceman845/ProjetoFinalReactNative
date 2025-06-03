// Importando os hooks e funções necessários do React para criação do contexto de autenticação
import React, { createContext, useState, useEffect } from 'react';
// Importando funções de autenticação do Firebase
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Importando a instância de autenticação do Firebase configurada no projeto
import { auth } from '../services/firebase';
// Importando AsyncStorage para persistência de dados entre sessões do app
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criando o contexto de autenticação que será usado em toda a aplicação
export const AuthContext = createContext();

/**
 * Provedor de contexto de autenticação que gerencia:
 * - Estado de autenticação do usuário
 * - Carrinho de compras
 * - Persistência de dados entre sessões
 */
export const AuthProvider = ({ children }) => {
  // Estado para armazenar informações do usuário autenticado
  const [user, setUser] = useState(null);
  // Estado para gerenciar itens do carrinho de compras
  const [cart, setCart] = useState([]);
  // Estado para controlar carregamento inicial e evitar operações durante a inicialização
  const [isLoading, setIsLoading] = useState(true);

  /**
   * useEffect para carregar o carrinho do AsyncStorage quando o componente é montado
   * Executado apenas uma vez na inicialização (array de dependências vazio)
   */
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Tenta recuperar o carrinho salvo no armazenamento local
        const savedCart = await AsyncStorage.getItem('userCart');
        if (savedCart !== null) {
          // Se encontrou dados, converte de JSON para objeto e atualiza o estado
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      } finally {
        // Marca o carregamento como concluído, independente de sucesso ou erro
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  /**
   * useEffect para salvar o carrinho no AsyncStorage sempre que ele for modificado
   * Só executa quando o carrinho muda ou quando o carregamento inicial é finalizado
   */
  useEffect(() => {
    const saveCart = async () => {
      try {
        // Só salva o carrinho se não estiver no estado de carregamento inicial
        // Isso evita sobrescrever dados salvos com um array vazio durante a inicialização
        if (!isLoading) {
          // Converte o array de objetos para string JSON e salva no AsyncStorage
          await AsyncStorage.setItem('userCart', JSON.stringify(cart));
        }
      } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
      }
    };

    saveCart();
  }, [cart, isLoading]);

  /**
   * useEffect para monitorar mudanças no estado de autenticação do Firebase
   * Configura um listener que atualiza o estado 'user' automaticamente quando:
   * - O usuário faz login
   * - O usuário faz logout
   * - O token de autenticação é atualizado
   */
  useEffect(() => {
    // onAuthStateChanged retorna uma função de cancelamento da inscrição
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Função de limpeza que é executada quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  /**
   * Função para realizar logout do usuário no Firebase Auth
   * O estado 'user' será atualizado automaticamente pelo listener onAuthStateChanged
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  };

  /**
   * Função para adicionar um item ao carrinho de compras
   * Utiliza o padrão funcional com callback para garantir que estamos trabalhando com o estado mais recente
   * @param {Object} item - O item a ser adicionado ao carrinho
   */
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  /**
   * Função para limpar completamente o carrinho de compras
   * Além de atualizar o estado, também remove os dados do AsyncStorage
   */
  const clearCart = async () => {
    // Limpa o estado do carrinho na memória
    setCart([]);
    try {
      // Remove os dados do carrinho do armazenamento persistente
      await AsyncStorage.removeItem('userCart');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  };

  /**
   * Fornece o contexto de autenticação para toda a árvore de componentes abaixo deste Provider
   * Expõe:
   * - user: objeto do usuário autenticado ou null
   * - logout: função para fazer logout
   * - cart: array com itens do carrinho
   * - addToCart: função para adicionar itens ao carrinho
   * - clearCart: função para limpar o carrinho
   * - isLoading: estado de carregamento inicial
   */
  return (
    <AuthContext.Provider value={{ user, logout, cart, addToCart, clearCart, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};