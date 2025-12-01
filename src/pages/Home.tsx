import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import type { Producto } from '../types';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import Pagination from '../components/Pagination';

export default function Home() {
  const [destacados, setDestacados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para paginación en Home
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const res = await api.get<Producto[]>('/productos');
        // Filtramos activos y con stock
        const productosValidos = res.data.filter(p => p.activo && p.stock > 0);
        setDestacados(productosValidos); 
      } catch (error) {
        console.error("Error cargando destacados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestacados();
  }, []);

  // Lógica de corte para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDestacados = destacados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(destacados.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const section = document.getElementById('destacados-section');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section (Carrusel) */}
      <section aria-label="Promociones Principales">
        <HeroCarousel />
      </section>

      {/* 2. SECCIÓN VIDEO (Corregida) */}
      {/* Usamos /embed/ en la URL para evitar el error X-Frame-Options */}
      <section className="bg-[#FDFBF7] py-16 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-6">
            El Arte de la Perfumería
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Descubre la pasión y el proceso detrás de las fragancias más exclusivas.
          </p>
          
          <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/P6dWT-N3dck" 
              title="Video Institucional"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* 3. Sección Destacados */}
      <section id="destacados-section" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
              <div className="h-1 w-20 bg-[#D4AF37] mt-2 rounded-full"></div>
            </div>
            <Link to="/catalogo" className="text-blue-600 hover:text-blue-800 font-medium hidden sm:block transition-colors">
              Ver catálogo completo &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500 animate-pulse">Cargando ofertas...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentDestacados.map(prod => (
                  <ProductCard key={prod.idProducto} producto={prod} />
                ))}
              </div>

              {/* Componente de Paginación */}
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
          
          {/* Botón ver todo para móviles */}
          <div className="mt-8 text-center sm:hidden">
             <Link to="/catalogo" className="text-blue-600 font-medium">Ver todo el catálogo</Link>
          </div>
        </div>
      </section>

      {/* 4. Sección Beneficios */}
       <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <article>
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="text-lg font-bold">Envío a todo Chile</h3>
            <p className="text-gray-500 text-sm">Despachos rápidos y seguros a tu domicilio.</p>
          </article>
          <article>
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-bold">Compra Segura</h3>
            <p className="text-gray-500 text-sm">Tus datos están protegidos con estándares bancarios.</p>
          </article>
          <article>
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-bold">Calidad Garantizada</h3>
            <p className="text-gray-500 text-sm">Perfumes 100% originales y sellados.</p>
          </article>
        </div>
      </section>
    </div>
  );
}