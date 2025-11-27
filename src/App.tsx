import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Importación de Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Gracias from './pages/Gracias';
import AdminProductos from './pages/AdminProductos';
import AdminUsuarios from './pages/AdminUsuarios';

function App() {
  return (
    <BrowserRouter>
      {/* 1. Proveedor de Autenticación (Envuelve todo) */}
      <AuthProvider>
        {/* 2. Proveedor de Carrito (Necesita Auth para saber de quién es el carrito) */}
        <CartProvider>
          
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

              {/* Rutas de Administrador (Requieren Login + Rol Admin) */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin" element={<Navigate to="/admin/productos" replace />} />
                <Route path="/admin/productos" element={<AdminProductos />} />
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              </Route>
            </Route>

            {/* Ruta 404 */}
            <Route path="*" element={<div className="p-5 text-center"><h1>404 - Página no encontrada</h1></div>} />
          </Routes>

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;