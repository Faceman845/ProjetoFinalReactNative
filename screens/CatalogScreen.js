import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Importe query e where
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const numColumns = 2;
const productPadding = 8; // Padding ao redor de cada item
const availableWidth = width - (productPadding * (numColumns + 1)); // Largura disponível descontando paddings laterais
const productWidth = availableWidth / numColumns;

export default function CatalogScreen({ route, navigation }) { // Adicione route e navigation
  const { user, addToCart, cart } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryFilter = route.params?.category; // Pega o parâmetro da categoria

  useEffect(() => {
    // Atualiza o título da tela se uma categoria for selecionada
    if (categoryFilter) {
      navigation.setOptions({ title: `Catálogo: ${categoryFilter}` });
    } else {
      navigation.setOptions({ title: 'Catálogo (Todos)' });
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let productsQuery;
        const productsCollectionRef = collection(db, 'produtos');

        if (categoryFilter) {
          // Filtragem no backend se o campo 'categoria' existir nos documentos
          productsQuery = query(productsCollectionRef, where('categoria', '==', categoryFilter));
        } else {
          // Sem filtro de categoria, busca todos os produtos
          productsQuery = query(productsCollectionRef);
        }

        const productsSnapshot = await getDocs(productsQuery);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Garanta que doc.data() inclua 'imageUrl' e 'nome', e opcionalmente 'preco'
        }));

        setProducts(productsList);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Falha ao carregar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, navigation]); // Re-execute o fetch se categoryFilter ou navigation mudar

  const isItemInCart = (itemId) => {
    return cart.some(item => item.id === itemId);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItemContainer}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => alert(`Detalhes de: ${item.nome}`)}>
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/200x180.png?text=Sem+Imagem' }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.nome}</Text>
          {item.preco && <Text style={styles.productPrice}>R$ {item.preco.toFixed(2)}</Text>}
        </View>
      </TouchableOpacity>
      {user ? (
        <TouchableOpacity
          style={[styles.addToCartButton, isItemInCart(item.id) ? styles.inCartButton : {}]}
          onPress={() => !isItemInCart(item.id) && addToCart(item)}
          disabled={isItemInCart(item.id)}
        >
          <Ionicons name={isItemInCart(item.id) ? "checkmark-circle" : "add-circle-outline"} size={24} color="white" />
          <Text style={styles.addToCartButtonText}>
            {isItemInCart(item.id) ? "No Carrinho" : "Adicionar"}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.loginPrompt}>Login para adicionar</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.messageText}>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Ionicons name="cloud-offline-outline" size={60} color="#757575" />
        <Text style={styles.messageTextError}>{error}</Text>
        <Button title="Tentar Novamente" onPress={() => fetchProducts()} color="#00BCD4"/>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Ionicons name="cube-outline" size={60} color="#757575" />
        <Text style={styles.messageText}>Nenhum produto encontrado</Text>
        {categoryFilter && <Text style={styles.messageTextSmall}>(para a categoria: {categoryFilter})</Text>}
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={renderProductItem}
      numColumns={numColumns}
      contentContainerStyle={styles.listContentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContentContainer: {
    padding: productPadding / 2, // Metade do padding para as bordas da lista
    backgroundColor: '#F5F5F5', // Fundo da lista
  },
  productItemContainer: {
    width: productWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: productPadding / 2, // Metade do padding entre os itens
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // Para borderRadius funcionar com sombra no Android
  },
  productImage: {
    width: '100%',
    height: productWidth * 0.9, // Altura proporcional à largura
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    minHeight: Platform.OS === 'ios' ? 36 : 40, // Para alinhar nomes com 1 ou 2 linhas
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796B', // Verde escuro para o preço
    marginBottom: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BCD4', // Azul do botão
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  inCartButton: {
    backgroundColor: '#4CAF50', // Verde quando no carrinho
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  loginPrompt: {
    fontSize: 12,
    color: '#E91E63', // Rosa/Vermelho para o aviso
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#FCE4EC'
  },
  centeredMessageContainer: { // Para loading, error, e empty
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  messageText: {
    marginTop: 15,
    fontSize: 17,
    color: '#424242',
    textAlign: 'center',
  },
  messageTextError: {
    marginTop: 15,
    fontSize: 17,
    color: '#D32F2F', // Vermelho para erro
    textAlign: 'center',
    marginBottom: 15,
  },
  messageTextSmall: {
      fontSize: 14,
      color: '#757575',
      marginTop: 5,
  }
});