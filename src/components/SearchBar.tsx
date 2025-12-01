import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import api from '../api/axiosConfig';
import type { Producto } from '../types';

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [mostrar, setMostrar] = useState(false);
  
  // Referencia para detectar clics fuera del componente
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Buscador productos al montar
  useEffect(() => {
    api.get<Producto[]>('/productos')
      .then(res => setProductos(res.data.filter(p => p.activo))) // Solo activos
      .catch(err => console.error("Error cargando productos para búsqueda", err));
  }, []);

  // Filtrar cuando cambia el query
  useEffect(() => {
    if (query.trim().length > 0) {
      const resultados = productos.filter(p => 
        p.nombreProducto.toLowerCase().includes(query.toLowerCase()) ||
        p.marca.nombreMarca.toLowerCase().includes(query.toLowerCase())
      );
      setSugerencias(resultados.slice(0, 5)); // Mostrar máx 5
      setMostrar(true);
    } else {
      setSugerencias([]);
      setMostrar(false);
    }
  }, [query, productos]);

  // Cerrar si clickeo fuera de barra de busqueda
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setMostrar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (prod: Producto) => {
  
    setQuery('');
    setMostrar(false);
    navigate('/catalogo'); 
    // pendiente de implemnetar opcion futura: navigate(`/producto/${prod.idProducto}`);
  };

  const clearSearch = () => {
    setQuery('');
    setMostrar(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-4 hidden md:block">
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder-gray-500 text-sm transition-all"
          placeholder="Buscar perfume..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setMostrar(true)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        {query && (
          <button 
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Lista de Sugerencias (Dropdown) */}
      {mostrar && sugerencias.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100">
          <ul>
            {sugerencias.map((prod) => (
              <li 
                key={prod.idProducto}
                onClick={() => handleSelect(prod)}
                className="cursor-pointer hover:bg-gray-50 p-3 border-b border-gray-100 last:border-none flex items-center gap-3 transition-colors"
              >
                {/* Imagen Miniatura */}
                <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                  <img 
                    src={prod.imagenUrl || "https://via.placeholder.com/40"} 
                    alt={prod.nombreProducto} 
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prod.nombreProducto}
                  </p>
                  <p className="text-xs text-gray-500">
                    {prod.marca.nombreMarca} • {prod.genero.nombreGenero}
                  </p>
                </div>

                {/* Precio */}
                <div className="text-sm font-semibold text-[#D4AF37]">
                  ${prod.precio.toLocaleString('es-CL')}
                </div>
              </li>
            ))}
          </ul>
          {/* Footer del dropdown */}
          <div 
            onClick={() => navigate('/catalogo')}
            className="bg-gray-50 p-2 text-center text-xs text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Ver todos los resultados
          </div>
        </div>
      )}
    </div>
  );
}