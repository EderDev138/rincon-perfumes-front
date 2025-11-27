import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import type { Producto } from '../types';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [destacados, setDestacados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar productos para mostrar algunos destacados
    const fetchDestacados = async () => {
      try {
        const res = await api.get<Producto[]>('/productos');
        // Filtramos solo los activos y con stock, y tomamos los primeros 3 o 4
        const productosValidos = res.data.filter(p => p.activo && p.stock > 0);
        setDestacados(productosValidos.slice(0, 4));
      } catch (error) {
        console.error("Error cargando destacados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestacados();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO SECTION (Banner) --- */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        {/* Imagen de fondo oscurecida */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1920&auto=format&fit=crop" 
            alt="Fondo Perfumes" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        {/* Contenido del Banner */}
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Descubre tu esencia ideal
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Explora nuestra colección exclusiva de fragancias importadas. 
            Desde notas florales hasta maderas profundas, tenemos el aroma perfecto para ti.
          </p>
          <div className="mt-10">
            <Link 
              to="/catalogo" 
              className="inline-block bg-blue-600 border border-transparent py-3 px-8 rounded-md font-medium text-white hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DESTACADOS --- */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
            <Link to="/catalogo" className="text-blue-600 hover:text-blue-800 font-medium hidden sm:block">
              Ver todo &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Cargando ofertas...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destacados.map(prod => (
                <ProductCard key={prod.idProducto} producto={prod} />
              ))}
            </div>
          )}
          
          {/* Botón ver todo para móviles */}
          <div className="mt-8 text-center sm:hidden">
             <Link to="/catalogo" className="text-blue-600 font-medium">Ver todo el catálogo</Link>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DE BENEFICIOS (Opcional, para dar look profesional) --- */}
      <div className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="text-lg font-bold">Envío a todo Chile</h3>
            <p className="text-gray-500 text-sm">Despachos rápidos y seguros a tu domicilio.</p>
          </div>
          <div>
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-bold">Compra Segura</h3>
            <p className="text-gray-500 text-sm">Tus datos están protegidos con estándares bancarios.</p>
          </div>
          <div>
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-bold">Calidad Garantizada</h3>
            <p className="text-gray-500 text-sm">Perfumes 100% originales y sellados.</p>
          </div>
        </div>
      </div>

    </div>
  );
}