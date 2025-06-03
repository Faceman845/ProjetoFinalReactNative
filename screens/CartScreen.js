import React, { useContext, useMemo } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen({ navigation }) {
  const { cart, clearCart, isLoading , removeItemFromCart } = useContext(AuthContext);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.preco || 0), 0);
  }, [cart]);

  if (isLoading && cart.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando carrinho...</Text>
      </View>
    );
  }

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/80x80.png?text=Sem+Imagem' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.nome || item.title || "Nome Indisponível"}</Text>
        <Text style={styles.itemPrice}>R$ {(item.preco || 0).toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => removeItemFromCart(item.id)} 
        style={styles.removeItemButton}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity> 
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Festas</Text>
      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyCartText}>Seu carrinho está vazio.</Text>
          <Button 
            title="Ver Catálogo" 
            onPress={() => navigation.navigate('Catalogo')}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContentContainer}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalPrice}>R$ {totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.footerButtons}>
            <Button 
              title="Continuar Comprando" 
              onPress={() => navigation.navigate('Catalogo')} 
              color="#007bff"
            />
            <View style={{width: 15}}/>
            <Button 
              title="Esvaziar Carrinho" 
              onPress={clearCart} 
              color="#dc3545"
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  listContentContainer: {
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 15,
    color: '#00796B',
  },
  removeItemButton: {
    padding: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 10,
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});