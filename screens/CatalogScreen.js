import React, { useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const packages = [
  { id: '1', title: 'Festa Unicórnio' },
  { id: '2', title: 'Festa Super-Herói' },
  { id: '3', title: 'Festa Safari' },
  { id: '4', title: 'Festa Princesa' },
  { id: '5', title: 'Festa Dinossauro' },
  { id: '6', title: 'Festa Circo' },
  { id: '7', title: 'Festa Espaço' },
  { id: '8', title: 'Festa Praia' },
  { id: '9', title: 'Festa Arco-Íris' },
  { id: '10', title: 'Festa Futebol' },
  { id: '11', title: 'Festa Pirata' },
  { id: '12', title: 'Festa Música' },
  { id: '13', title: 'Festa Cinema' },
  { id: '14', title: 'Festa Aventura' },
  { id: '15', title: 'Festa Magia' },
  { id: '16', title: 'Festa Animais' },
  { id: '17', title: 'Festa Natal' },
  { id: '18', title: 'Festa Halloween' },
  { id: '19', title: 'Festa Dia das Crianças' },
  { id: '20', title: 'Festa Aniversário' },
];

export default function CatalogScreen() {
  const { user, addToCart } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            {user ? (
              <Button title="Adicionar ao carrinho" onPress={() => addToCart(item)} />
            ) : (
              <Text style={styles.warning}>Faça login para adicionar ao carrinho.</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  warning: {
    color: 'red',
    marginTop: 5,
  },
});