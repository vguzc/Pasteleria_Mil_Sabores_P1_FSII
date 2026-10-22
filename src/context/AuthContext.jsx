import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/db';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => userService.getActiveUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(userService.getActiveUser());
    };
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const login = (correo, clave) => {
    const user = userService.authenticate(correo, clave);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Correo o contraseña incorrectos.' };
  };

  const logout = () => {
    userService.logout();
    setCurrentUser(null);
  };

  const updateUser = (fields) => {
    if (!currentUser) return null;
    const updated = userService.update(currentUser.id, fields);
    setCurrentUser(updated);
    return updated;
  };

  const isAdmin = currentUser?.rol === 'administrador';
  const isVendedor = currentUser?.rol === 'vendedor';
  const isCliente = currentUser?.rol === 'cliente' || (!isAdmin && !isVendedor && !!currentUser);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser, isAdmin, isVendedor, isCliente }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      login: () => ({ success: false }),
      logout: () => {},
      updateUser: () => null,
      isAdmin: false,
      isVendedor: false,
      isCliente: false
    };
  }
  return context;
}
