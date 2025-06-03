import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import CatalogScreen from '../screens/CatalogScreen';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <DrawerContentScrollView style={{ backgroundColor: '#1e1e1e' }}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.username}>Olá, usuário!</Text>
      </View>
      <DrawerItem
        label="Catálogo"
        labelStyle={styles.label}
        onPress={() => navigation.navigate('Catalog')}
      />
      <DrawerItem
        label="Sair"
        labelStyle={styles.label}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Catalog"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#ccc',
      }}
    >
      <Drawer.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catálogo' }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#121212',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginLeft: -10,
  },
});
