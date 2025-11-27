import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      {/* 1. Proveedor de Autenticación */}
      <AuthProvider>
        {/* 2. Proveedor de Carrito */}
        <CartProvider>
          
          {/* 3. Rutas de la Aplicación */}
          <AppRoutes />

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;