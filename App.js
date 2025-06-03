import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import Routes from './navigation/Routes';
export default function App() {
  return (
    <SafeAreaView style={styles.appContainer}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});