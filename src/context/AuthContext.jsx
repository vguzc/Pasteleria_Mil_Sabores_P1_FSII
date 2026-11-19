import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/db';
import { authApi, tokenStorage } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => userService.getActiveUser());
  const [jwtToken, setJwtToken] = useState(() => tokenStorage.get());

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(userService.getActiveUser());
      setJwtToken(tokenStorage.get());
    };
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  // Intentar validar/sincronizar sesión con backend en recarga de página si hay token JWT
  useEffect(() => {
    const syncSession = async () => {
      const token = tokenStorage.get();
      if (token && (!currentUser || !currentUser.correo)) {
        try {
          const perfil = await authApi.me();
          if (perfil) {
            userService.setActiveUser(perfil);
            setCurrentUser(perfil);
          }
        } catch {
          // Si el backend no responde, la sesión local en localStorage se mantiene activa
        }
      }
    };
    syncSession();
  }, []);

  const login = async (correo, clave) => {
    // 1. Intentar autenticar contra el Backend Spring Boot con JWT
    try {
      const res = await authApi.login(correo, clave);
      if (res && res.token && res.usuario) {
        setJwtToken(res.token);
        userService.setActiveUser(res.usuario);
        setCurrentUser(res.usuario);
        return { success: true, user: res.usuario, token: res.token };
      }
    } catch (apiError) {
      console.warn('Backend Spring Boot no disponible o credenciales inválidas en API, probando fallback local:', apiError.message);
    }

    // 2. Fallback de persistencia local (para pruebas unitarias y modo offline)
    const localUser = userService.authenticate(correo, clave);
    if (localUser) {
      setCurrentUser(localUser);
      return { success: true, user: localUser };
    }

    return { success: false, message: 'Correo o contraseña incorrectos.' };
  };

  const logout = () => {
    authApi.logout();
    userService.logout();
    tokenStorage.remove();
    setCurrentUser(null);
    setJwtToken(null);
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
    <AuthContext.Provider value={{
      currentUser,
      jwtToken,
      login,
      logout,
      updateUser,
      isAdmin,
      isVendedor,
      isCliente
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      jwtToken: null,
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
