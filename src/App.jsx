import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0d1f3c',
              color: '#e2e8f0',
              border: '1px solid #162f62',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#f5c518', secondary: '#060d1f' },
            },
            error: {
              iconTheme: { primary: '#ff5252', secondary: '#060d1f' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
