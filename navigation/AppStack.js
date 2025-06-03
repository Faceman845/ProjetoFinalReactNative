import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Image, TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthContext';
import CatalogScreen from '../screens/CatalogScreen';
import CartScreen from '../screens/CartScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
// --- IMAGENS ---
const headerLogoImage = require('../assets/header_logo_image.png');

const Drawer = createDrawerNavigator();

// Componente de Título Customizado para o Header (Logo)
function CustomHeaderTitle() {
  return (
    <Image style={styles.headerLogo} source={headerLogoImage} resizeMode="contain"/>
  );
}

// Componente de Conteúdo Customizado para o Drawer (Menu Lateral)
function CustomDrawerContent(props) {
  const { navigation } = props;
  const { logout } = useContext(AuthContext);

  const categories = [
    { id: 'cat1', name: 'Meninos', icon: 'male-outline' },
    { id: 'cat2', name: 'Meninas', icon: 'female-outline' },
    { id: 'cat3', name: 'Super-Heróis', icon: 'shield-checkmark-outline' },
    { id: 'cat4', name: 'Desenho-Animado', icon: 'tv-outline' },
    { id: 'cat5', name: 'Filme', icon: 'film-outline' },
  ];

  const handleCategoryPress = (categoryName) => {
    navigation.navigate('Catalogo', { category: categoryName });
    navigation.closeDrawer();
  };

  const handleLogout = async () => {
    navigation.closeDrawer(); 
    await logout();
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>CATEGORIAS</Text>
      </View>

      {/* Item de navegação para o Catálogo (Todos) - será a tela inicial */}
      <DrawerItem
        label="Catálogo (Todos)"
        labelStyle={styles.drawerLabel}
        onPress={() => {
          navigation.navigate('Catalogo', { category: null });
          navigation.closeDrawer();
        }}
        icon={({ focused, color, size }) => <Ionicons name={focused ? "list-circle" : "list-circle-outline"} size={size} color={styles.drawerLabel.color} />}
      />

      {/* Separador */} 
      <View style={styles.drawerSeparator} />

      {/* Categorias */}
      {categories.map(category => (
        <DrawerItem
          key={category.id}
          label={category.name}
          labelStyle={styles.drawerLabel}
          onPress={() => handleCategoryPress(category.name)}
          icon={({ focused, color, size }) => <Ionicons name={category.icon || "ellipse-outline"} size={size * 0.9} color={styles.drawerLabel.color} />}
        />
      ))}

      {/* Separador */}
      <View style={styles.drawerSeparator} />

      <DrawerItem
        label="Carrinho"
        labelStyle={styles.drawerLabel}
        onPress={() => navigation.navigate('Carrinho')}
        icon={({ focused, color, size }) => <Ionicons name={focused ? "cart" : "cart-outline"} size={size} color={styles.drawerLabel.color} />}
      />

      {/* Item de Sair */}
      <View style={styles.drawerSeparator} />
      <DrawerItem
        label="Sair"
        labelStyle={styles.drawerLabelLogout} // Pode ter um estilo diferente se quiser
        onPress={handleLogout}
        icon={({ focused, color, size }) => <Ionicons name="log-out-outline" size={size} color={styles.drawerLabelLogout.color || styles.drawerLabel.color} />}
      />
    </DrawerContentScrollView>
  );
}

export default function AppStack() {
  return (
    <Drawer.Navigator
      initialRouteName="Catalogo" // Define Catalogo como a tela inicial
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#00BCD4',
          elevation: 4,
          shadowOpacity: 0.1,
          shadowRadius: 3,
          shadowOffset: {height: 2, width: 0}
        },
        headerTintColor: '#FFFFFF',
        headerTitleAlign: 'center',
        headerTitle: (props) => <CustomHeaderTitle {...props} />,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.headerButton}>
            <Ionicons name="menu" size={30} color="white" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={styles.headerButton}>
            <Ionicons name="person-circle-outline" size={30} color="white" />
          </TouchableOpacity>
        ),
        drawerActiveTintColor: '#FF69B4',
        drawerInactiveTintColor: '#FFFFFF',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
          fontWeight: '500',
        },
        drawerStyle: {
            backgroundColor: '#00BCD4',
        }
      })}
    >
      <Drawer.Screen name="Catalogo" component={CatalogScreen} options={{ title: 'Catálogo' }} />
      <Drawer.Screen name="Carrinho" component={CartScreen} options={{ title: 'Carrinho' }} />
      <Drawer.Screen name="Perfil" component={UserProfileScreen} options={{ title: 'Meu Perfil' }}/>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    width: 120,
    height: 35,
  },
  headerLogoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'Roboto-Medium',
  },
  headerButton: {
    paddingHorizontal: 15,
  },
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: '#00A5BB',
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  drawerLabel: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: -8,
  },
  drawerLabelLogout: { // Estilo opcional para o botão de sair
    color: '#FFDDE2', // Exemplo: uma cor um pouco diferente para destaque
    fontSize: 15,
    fontWeight: '500',
    marginLeft: -8,
  },
  drawerSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 10,
    marginHorizontal: 15,
  }
});