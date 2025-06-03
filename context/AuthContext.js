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

  // Load cart from AsyncStorage when the component mounts
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

  // Save cart to AsyncStorage whenever it changes
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

  const clearCart = async () => {
    setCart([]);
    // Clear cart from AsyncStorage
    try {
      await AsyncStorage.removeItem('userCart');
    } catch (error) {
      console.error('Error clearing cart from AsyncStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, cart, addToCart, clearCart, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};