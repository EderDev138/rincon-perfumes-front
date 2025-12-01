import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface Props {
  requireAdmin?: boolean; // Exigir como prop rol de admin
}

export const ProtectedRoute = ({ requireAdmin = false }: Props) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext)!;

  if (loading) return <div>Cargando...</div>;

  //Si no está logueado, mandara al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //Si requiere admin y el usuario no lo es, mandar al home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderizar la ruta hija
  return <Outlet />;
};