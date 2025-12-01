import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  
  // Si no hay suficientes páginas, no mostramos nada
  if (totalPages <= 1) return null;

  // Lógica para mostra maximo 5 paginas
  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / 5) * 5;
    return new Array(Math.min(5, totalPages - start))
      .fill(0)
      .map((_, idx) => start + idx + 1);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md border flex items-center justify-center transition-all duration-300 ${
          currentPage === 1 
            ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
            : 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white shadow-sm'
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Números de Página */}
      <div className="flex gap-2">
        {getPaginationGroup().map((item) => (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`w-10 h-10 rounded-md font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
              currentPage === item
                ? 'bg-[#D4AF37] text-white shadow-md border border-[#D4AF37]' // Activo
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37]' // Inactivo
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md border flex items-center justify-center transition-all duration-300 ${
          currentPage === totalPages 
            ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
            : 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white shadow-sm'
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}