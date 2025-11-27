import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axiosConfig';
import type { LoginResponse } from '../types'; 


interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean; // Necesario para el menú de admin
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      // Aquí podrías decodificar el token para verificar rol o expiración
      // Por simplicidad académica asumiremos que si hay token, es válido hasta que falle la API
      const storedUser = localStorage.getItem('user_name');
      setUser(storedUser);
      // Lógica simple para detectar admin (idealmente vendría en el payload del token)
      // En el backend el admin es admin@test.cl
      setIsAdmin(storedUser?.includes('Admin') || false); 
    }
  }, [token]);

  const login = async (correo: string, contrasena: string) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { correo, contrasena });
      if (response.data.autenticado && response.data.token) {
        const newToken = response.data.token;
        localStorage.setItem('jwt_token', newToken);
        localStorage.setItem('user_name', response.data.nombreUsuario);
        setToken(newToken);
        setUser(response.data.nombreUsuario);
        setIsAdmin(response.data.nombreUsuario.includes('Admin') || correo.includes('admin')); 
      } else {
        throw new Error(response.data.mensaje);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_name');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};