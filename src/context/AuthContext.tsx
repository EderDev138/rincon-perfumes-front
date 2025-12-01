import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axiosConfig';
import type { LoginResponse, Usuario } from '../types'; // Importamos el tipo Usuario

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUser = localStorage.getItem('user_data');

    if (storedToken && storedUser) {
      const parsedUser: Usuario = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      // Validar si es admin basado en el correo o rol
      setIsAdmin(parsedUser.correo === 'admin@test.cl'); 
    }
    setLoading(false);
  }, []);

  const login = async (correo: string, contrasena: string) => {
    try {
      //Login para obtener token
      const resLogin = await api.post<LoginResponse>('/auth/login', { correo, contrasena });
      
      if (resLogin.data.autenticado && resLogin.data.token) {
        const newToken = resLogin.data.token;

        //Buscar datos completos del usuario (para tener el ID)
        const resUsers = await api.get<Usuario[]>('/usuarios');
        const usuarioEncontrado = resUsers.data.find(u => u.correo === correo);

        if (usuarioEncontrado) {
          localStorage.setItem('jwt_token', newToken);
          localStorage.setItem('user_data', JSON.stringify(usuarioEncontrado));
          
          setToken(newToken);
          setUser(usuarioEncontrado);
          setIsAdmin(usuarioEncontrado.correo === 'admin@test.cl');
        } else {
           throw new Error("No se pudieron obtener los datos del usuario");
        }
      } else {
        throw new Error(resLogin.data.mensaje);
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