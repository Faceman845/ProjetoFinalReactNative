import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import CartScreen from '../screens/CartScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Drawer = createDrawerNavigator();

export default function AppStack() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Catalogo" component={CatalogScreen} />
      <Drawer.Screen name="Carrinho" component={CartScreen} />
      <Drawer.Screen name="Meu Perfil" component={UserProfileScreen} />
    </Drawer.Navigator>
  );
}