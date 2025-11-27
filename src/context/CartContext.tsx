import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axiosConfig';
// Importamos la interfaz Usuario y LoginResponse
import type { LoginResponse, Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null; // AHORA ES UN OBJETO, NO UN STRING
  token: string | null;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean; // Para evitar redirecciones prematuras
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 1. Cargar sesión al recargar la página
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUser = localStorage.getItem('user_data'); // Leemos el objeto completo

    if (storedToken && storedUser) {
      const parsedUser: Usuario = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      // Verificación simple de rol basada en el correo (ajustar según necesidad)
      setIsAdmin(parsedUser.correo.includes('admin') || parsedUser.correo === 'admin@test.cl');
    }
    setLoading(false);
  }, []);

  const login = async (correo: string, contrasena: string) => {
    try {
      // Paso 1: Obtener Token
      const response = await api.post<LoginResponse>('/auth/login', { correo, contrasena });
      
      if (response.data.autenticado && response.data.token) {
        const newToken = response.data.token;

        // Paso 2: TRUCO - Como el login no devuelve el ID, buscamos el usuario por su correo
        // (Esto es posible porque el endpoint /usuarios es público en tu backend)
        const usuariosRes = await api.get<Usuario[]>('/usuarios');
        const usuarioEncontrado = usuariosRes.data.find(u => u.correo === correo);

        if (usuarioEncontrado) {
          // Guardamos todo en localStorage
          localStorage.setItem('jwt_token', newToken);
          localStorage.setItem('user_data', JSON.stringify(usuarioEncontrado)); // Guardamos el objeto

          setToken(newToken);
          setUser(usuarioEncontrado);
          setIsAdmin(usuarioEncontrado.correo.includes('admin'));
        } else {
            throw new Error("Usuario no encontrado en la base de datos");
        }
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
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};