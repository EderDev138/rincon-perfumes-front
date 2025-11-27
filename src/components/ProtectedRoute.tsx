import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface Props {
  requireAdmin?: boolean; // Opción para exigir rol de administrador
}

export const ProtectedRoute = ({ requireAdmin = false }: Props) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext)!;

  if (loading) return <div>Cargando...</div>; // O un Spinner

  // 1. Si no está logueado, mandar al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si requiere admin y el usuario no lo es, mandar al home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 3. Si todo está bien, renderizar la ruta hija
  return <Outlet />;
};