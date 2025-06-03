// Importando os hooks e funções necessários do React para criação do contexto de autenticação
import React, { createContext, useState, useEffect } from 'react';
// Importando funções de autenticação do Firebase
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Importando a instância de autenticação do Firebase configurada no projeto
import { auth } from '../services/firebase';
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
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o carrinho de compras do AsyncStorage quando o componente é montado
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('userCart');
        if (savedCart !== null) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Efeito para salvar o carrinho de compras no AsyncStorage sempre que ele for atualizado
  // Isso garante que o carrinho persista entre as sessões do usuário
  useEffect(() => {
    const saveCart = async () => {
      try {
        if (!isLoading) { // Prevent saving during initial load
          await AsyncStorage.setItem('userCart', JSON.stringify(cart));
        }
      } catch (error) {
        console.error('Error saving cart to AsyncStorage:', error);
      }
    };

    saveCart();
  }, [cart, isLoading]);
  // Listener para monitorar mudanças no estado de autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  /**
   * Função para realizar logout do usuário no Firebase Auth
   * O estado 'user' será atualizado automaticamente pelo listener onAuthStateChanged
   */
  const logout = async () => {
    try {
      // Only sign out from Firebase, don't clear cart
      await signOut(auth);
      console.log('[DEBUG] User signed out, cart preserved');
    } catch (error) {
      console.error('Error during logout:', error);
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

  // Função para limpar o carrinho de compras
  // Esta função remove todos os itens do carrinho e também limpa o AsyncStorage
  const clearCart = async () => {
    setCart([]);
    // Clear cart from AsyncStorage
    try {
      await AsyncStorage.removeItem('userCart');
    } catch (error) {
      console.error('Erro ao limpar o carrinho:', error);
    }
  };
  // Função para remover um item específico do carrinho de compras
  const removeItemFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  // Retorna o contexto de autenticação com os valores necessários
  return (
    <AuthContext.Provider value={{ user, logout, cart, addToCart, clearCart, isLoading , removeItemFromCart }}>
      {children}
    </AuthContext.Provider>
  );
};