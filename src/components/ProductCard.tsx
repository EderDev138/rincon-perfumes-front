import { useContext } from 'react';
import type { Producto } from '../types';
import { CartContext } from '../context/CartContext';

interface Props {
  producto: Producto;
}

export default function ProductCard({ producto }: Props) {
  const { addToCart } = useContext(CartContext)!;

  // Formateador de moneda CLP
  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(producto.precio);

  // Usamos <article> en lugar de <div> 
  return (
    <article className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden h-full">
      
      {/* Imagen del Producto */}
      <figure className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={producto.imagenUrl || "https://placehold.co/400x400?text=Sin+Imagen"}
          alt={producto.nombreProducto}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy" // Optimización de carga
        />
        {/* Badge de Marca */}
        <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full uppercase tracking-wider">
          {producto.marca.nombreMarca}
        </span>
      </figure>

      {/* Información */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
          {producto.nombreProducto}
        </h3>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2 min-h-[40px]">
          {producto.descripcion}
        </p>
        
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <span>{producto.genero.nombreGenero}</span>
            <span>•</span>
            <span>{producto.volumenML}ml</span>
            <span>•</span>
            <span>{producto.tipoProducto.nombreTipo}</span>
        </div>

        {/* Precio y Botón */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-blue-600">
            {precioFormateado}
          </span>
          
          <button
            onClick={() => addToCart(producto)}
            disabled={producto.stock <= 0}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              producto.stock > 0
                ? "bg-gray-900 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-label={`Agregar ${producto.nombreProducto} al carrito`}
          >
            {producto.stock > 0 ? "Agregar" : "Agotado"}
          </button>
        </div>
      </div>
    </article>
  );
}