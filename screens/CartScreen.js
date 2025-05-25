import React, { useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function CartScreen() {
  const { cart, clearCart } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de compras</Text>
      {cart.length === 0 ? (
        <Text>Seu carrinho está vazio.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.item}>{item.title}</Text>
            )}
          />
          <Button title="Esvaziar Carrinho" onPress={clearCart} color="red" />
        </>
      )}
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
});