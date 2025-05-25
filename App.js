import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Routes from './navigation/Routes';

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
