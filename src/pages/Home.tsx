import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import type { Producto } from '../types';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import Pagination from '../components/Pagination'; // <--- Importar

export default function Home() {
  const [destacados, setDestacados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para paginación en Home
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Mostramos solo 4 por página en el home

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const res = await api.get<Producto[]>('/productos');
        // Filtramos activos y con stock
        const productosValidos = res.data.filter(p => p.activo && p.stock > 0);
        
        // destacados aca
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
      
      <HeroCarousel />

      {/* SECCIÓN DESTACADOS CON PAGINACIÓN */}
      <div id="destacados-section" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
            <Link to="/catalogo" className="text-blue-600 hover:text-blue-800 font-medium hidden sm:block">
              Ver catálogo completo &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Cargando ofertas...</div>
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
          
        </div>
      </div>

      {/* beneficios */}
       <div className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* ... Iconos ... */}

            
        </div>
      </div>
    </div>
  );
}