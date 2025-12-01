import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import type { Producto, Marca, Categoria, Genero } from '../types';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import SidebarFiltros from '../components/SidebarFiltros';

export default function Catalogo() {
  // extraccion de datos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- Estados de Filtros y Paginación ---
  const [filtros, setFiltros] = useState({ idMarca: 0, idCategoria: 0, idGenero: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // -carga de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resMarca, resCat, resGen] = await Promise.all([
          api.get<Producto[]>('/productos'),
          api.get<Marca[]>('/marcas'),
          api.get<Categoria[]>('/categorias'),
          api.get<Genero[]>('/generos')
        ]);
        setProductos(resProd.data.filter(p => p.activo));
        setMarcas(resMarca.data);
        setCategorias(resCat.data);
        setGeneros(resGen.data);
      } catch (error) {
        console.error("Error al cargar datos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // logica de datos y filtros
  const productosFiltrados = productos.filter(prod => {
    const coincideMarca = filtros.idMarca === 0 || prod.marca.idMarca === Number(filtros.idMarca);
    const coincideCategoria = filtros.idCategoria === 0 || prod.categoria.idCategoria === Number(filtros.idCategoria);
    const coincideGenero = filtros.idGenero === 0 || prod.genero.idGenero === Number(filtros.idGenero);
    return coincideMarca && coincideCategoria && coincideGenero;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  // paginacion
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: Number(e.target.value) });
    setCurrentPage(1); 
  };

  const limpiarFiltros = () => {
    setFiltros({ idMarca: 0, idCategoria: 0, idGenero: 0 });
    setCurrentPage(1);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#D4AF37] font-serif">Cargando catálogo...</div>;

  return (
    // CAMBIO: div principal sigue siendo div wrapper, pero el contenido usa section
    <div className="bg-[#FDFBF7] min-h-screen py-10 transition-colors duration-500">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título */}
        <header className="text-center mb-10 animate-fade-in-down">
          <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-4">Catálogo Exclusivo</h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
        </header>

        {/* Contenido Principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <SidebarFiltros 
            marcas={marcas}
            categorias={categorias}
            generos={generos}
            filtros={filtros}
            totalResultados={productosFiltrados.length}
            onFilterChange={handleFilterChange}
            onLimpiar={limpiarFiltros}
          />

          {/* Grilla de Productos */}
          <div className="w-full lg:w-3/4">
            {productosFiltrados.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map(prod => (
                    <ProductCard key={prod.idProducto} producto={prod} />
                  ))}
                </div>

                <div className="mt-8">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg mb-4">No encontramos perfumes con esa combinación.</p>
                <button 
                  onClick={limpiarFiltros}
                  className="px-6 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#AA8C2C] transition-colors"
                >
                  Ver todo el catálogo
                </button>
              </div>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}