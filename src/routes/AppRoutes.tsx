import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Catalogo from '../pages/Catalogo';
import Carrito from '../pages/Carrito';
import Gracias from '../pages/Gracias';
import AdminProductos from '../pages/AdminProductos';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas dentro del Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas Protegidas (Requieren Login) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/gracias" element={<Gracias />} />
        </Route>

        {/* Rutas de Administrador  Login*/}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin" element={<Navigate to="/admin/productos" replace />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          {/* <Route path="/admin/usuarios" element={<AdminUsuarios />} en implementacion /> */}
        </Route>
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<div className="p-5 text-center"><h1>404 - Página no encontrada</h1></div>} />
    </Routes>
  );
};