import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import SearchBar from './SearchBar';
import { ChevronDown, Users, Package, ShoppingBag } from 'lucide-react'; // Importamos ShoppingBag

export default function NavigationBar() {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext)!;
  const { items } = useContext(CartContext)!;
  const navigate = useNavigate();

  // Estado para controlar el dropdown de Admin en desktop
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#1A1A1A] text-white shadow-lg border-b border-[#D4AF37]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/*Logo y Links Izquierda */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <Link to="/" className="text-2xl font-serif font-bold text-[#D4AF37] hover:text-white transition-colors">
              Rincón Perfumes
            </Link>
            
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:text-[#D4AF37] transition-colors">
                Inicio
              </Link>
              <Link to="/catalogo" className="px-3 py-2 rounded-md text-sm font-medium hover:text-[#D4AF37] transition-colors">
                Catálogo
              </Link>

              {/* Menu desplegable*/}
              {isAdmin && (
                <div 
                  className="relative group"
                  onMouseEnter={() => setShowAdminMenu(true)}
                  onMouseLeave={() => setShowAdminMenu(false)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-yellow-500 hover:text-yellow-300 focus:outline-none">
                    Administración
                    <ChevronDown size={14} />
                  </button>

                  {/* Dropdown Content */}
                  <div className={`absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 transition-all duration-200 transform origin-top-left z-50 ${
                    showAdminMenu ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                  }`}>
                    <Link 
                      to="/admin/productos" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]"
                    >
                      <Package size={16} /> Productos
                    </Link>
                    <Link 
                      to="/admin/usuarios" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]"
                    >
                      <Users size={16} /> Usuarios
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buscador */}
          <div className="flex-1 flex justify-center max-w-lg">
             <SearchBar />
          </div>

          {/* Carrito y Usuario */}
          <div className="flex items-center gap-4 flex-shrink-0">
            
            {/* Carrito */}
            {isAuthenticated && (
              <Link to="/carrito" className="relative p-2 text-gray-300 hover:text-[#D4AF37] transition-colors">
                <span className="sr-only">Ver carrito</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-[#1A1A1A] bg-[#D4AF37] rounded-full transform translate-x-1/4 -translate-y-1/4">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Usuario menu desplegado */}
            <div className="ml-2 relative flex items-center gap-4 group">
              {isAuthenticated ? (
                <div className="relative">
                  {/* Muestra usuario logeado */}
                  <button className="flex flex-col items-end focus:outline-none hover:opacity-80 transition-opacity">
                    <span className="text-xs text-gray-400">Bienvenido</span>
                    <span className="text-sm font-semibold text-[#D4AF37] flex items-center gap-1">
                      {user?.nombre} <ChevronDown size={12}/>
                    </span>
                  </button>

                  {/* Dropdown del Usuario */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    
                    {/* Link a Mis Pedidos */}
                    <Link 
                      to="/mis-pedidos" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                    >
                      <ShoppingBag size={16} /> Mis Pedidos
                    </Link>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Salir
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-x-2 text-sm">
                  <Link to="/login" className="hover:text-[#D4AF37]">Ingresar</Link>
                  <span className="text-gray-600">|</span>
                  <Link to="/registro" className="font-semibold text-[#D4AF37] hover:text-white">Crear Cuenta</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}