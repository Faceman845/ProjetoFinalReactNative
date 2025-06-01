import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
      
      // If user logs out, we can optionally clear the cart
      // Uncomment this if you want to clear cart on logout
      // if (!currentUser) {
      //   clearCart();
      // }
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCart([]);
    // Clear cart from AsyncStorage on logout
    try {
      await AsyncStorage.removeItem('userCart');
    } catch (error) {
      console.error('Error clearing cart from AsyncStorage:', error);
    }
  };

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