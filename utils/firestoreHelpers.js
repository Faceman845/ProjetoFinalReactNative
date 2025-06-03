import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Alert } from 'react-native';

/**
 * Utilitários para operações com o Firestore
 */

/**
 * Carrega os dados do usuário do Firestore
 * @param {string} userId - ID do usuário
 * @returns {Promise<Object|null>} - Dados do usuário ou null se não existir
 */
export const carregarDadosUsuario = async (userId) => {
  if (!userId) {
    return null;
  }
  
  try {
    const userDocRef = doc(db, 'usuarios', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    throw error;
  }
};

/**
 * Salva os dados do usuário no Firestore
 * @param {string} userId - ID do usuário
 * @param {Object} userData - Dados do usuário a serem salvos
 * @returns {Promise<void>}
 */
export const salvarDadosUsuario = async (userId, userData) => {
  if (!userId) {
    throw new Error('ID do usuário é obrigatório');
  }
  
  try {
    const userDocRef = doc(db, 'usuarios', userId);
    await setDoc(userDocRef, userData, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error);
    throw error;
  }
};

/**
 * Exclui os dados do usuário do Firestore
 * @param {string} userId - ID do usuário
 * @returns {Promise<boolean>} - true se excluído com sucesso, false se não existir
 */
export const excluirDadosUsuario = async (userId) => {
  if (!userId) {
    throw new Error('ID do usuário é obrigatório');
  }
  
  try {
    const userDocRef = doc(db, 'usuarios', userId);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      await deleteDoc(userDocRef);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao excluir dados do usuário:', error);
    throw error;
  }
};
