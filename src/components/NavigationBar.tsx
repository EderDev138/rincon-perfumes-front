import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function NavigationBar() {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext)!;
  const { items } = useContext(CartContext)!;
  const navigate = useNavigate();

  // Calcular cantidad total de items en el carrito
  const cartCount = items.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y Links Principales */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-white hover:text-gray-300">
              Rincón Perfumes
            </Link>
            
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Inicio
                </Link>
                <Link to="/catalogo" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Catálogo
                </Link>

                {/* Enlaces de Admin (Solo visibles si es admin) */}
                {isAdmin && (
                  <>
                    <Link to="/admin/productos" className="px-3 py-2 rounded-md text-sm font-medium text-yellow-400 hover:text-yellow-300">
                      Admin Productos
                    </Link>
                    <Link to="/admin/usuarios" className="px-3 py-2 rounded-md text-sm font-medium text-yellow-400 hover:text-yellow-300">
                      Admin Usuarios
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Lado Derecho: Carrito y Usuario */}
          <div className="flex items-center gap-4">
            
            {/* Botón Carrito */}
            {isAuthenticated && (
              <Link to="/carrito" className="relative p-2 text-gray-300 hover:text-white">
                <span className="sr-only">Ver carrito</span>
                {/* Icono de Carrito SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                
                {/* Badge (Contador) */}
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Menú de Usuario */}
            <div className="ml-3 relative flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-300">
                    Hola, <span className="font-semibold text-white">{user}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium border border-gray-600 transition-colors"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Ingresar
                  </Link>
                  <Link to="/registro" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}