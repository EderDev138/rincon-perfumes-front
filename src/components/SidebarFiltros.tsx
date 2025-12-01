import { Filter, X } from 'lucide-react';
import type { Marca, Categoria, Genero } from '../types';

interface FiltrosState {
  idMarca: number;
  idCategoria: number;
  idGenero: number;
  precioMax?: number;
}

interface Props {
  marcas: Marca[];
  categorias: Categoria[];
  generos: Genero[];
  filtros: FiltrosState;
  totalResultados: number;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onLimpiar: () => void;
}

export default function SidebarFiltros({ 
  marcas, 
  categorias, 
  generos, 
  filtros, 
  totalResultados, 
  onFilterChange, 
  onLimpiar 
}: Props) {

  const tieneFiltrosActivos = filtros.idMarca !== 0 || filtros.idCategoria !== 0 || filtros.idGenero !== 0;

  const selectClass = "w-full p-2 border border-gray-200 rounded-md focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm bg-white";

  return (
    <aside className="w-full lg:w-1/4 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#D4AF37]/20 sticky top-24 transition-all duration-300">
        
        {/* Encabezado del Filtro */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Filter size={20} className="text-[#D4AF37]"/> 
            Filtros
          </h3>
          {tieneFiltrosActivos && (
            <button 
              onClick={onLimpiar} 
              className="text-xs text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors"
            >
              <X size={14} /> Limpiar
            </button>
          )}
        </div>
        
        {/* --- Selectores --- */}
        <div className="space-y-5">
          
          {/* Filtro Género */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Género</label>
            <select 
              name="idGenero" 
              value={filtros.idGenero} 
              onChange={onFilterChange}
              className={selectClass}
            >
              <option value={0}>Todos los Géneros</option>
              {generos.map(g => (
                <option key={g.idGenero} value={g.idGenero}>{g.nombreGenero}</option>
              ))}
            </select>
          </div>

          {/* Filtro Marca */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Marca</label>
            <select 
              name="idMarca" 
              value={filtros.idMarca} 
              onChange={onFilterChange}
              className={selectClass}
            >
              <option value={0}>Todas las Marcas</option>
              {marcas.map(m => (
                <option key={m.idMarca} value={m.idMarca}>{m.nombreMarca}</option>
              ))}
            </select>
          </div>

          {/* Filtro Categoría */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Familia Olfativa</label>
            <select 
              name="idCategoria" 
              value={filtros.idCategoria} 
              onChange={onFilterChange}
              className={selectClass}
            >
              <option value={0}>Todas las Categorías</option>
              {categorias.map(c => (
                <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Contador de Resultados */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <span className="text-xs font-medium text-gray-400">
            {totalResultados} {totalResultados === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

      </div>
    </aside>
  );
}