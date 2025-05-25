import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { logout, clearCart } = useContext(AuthContext);

  const handleLogout = () => {
    clearCart();
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao App de Festas!</Text>
      <Button title="Ver Catálogo" onPress={() => navigation.navigate('Catalogo')} />
      <View style={styles.spacing} />
      <Button title="Ver Carrinho" onPress={() => navigation.navigate('Carrinho')} />
      <View style={styles.spacing} />
      <Button title="Sair" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
  },
  spacing: {
    height: 10,
  },
});