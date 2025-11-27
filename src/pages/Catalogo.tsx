// src/pages/Catalogo.tsx (Versión resumida)
import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import type { Producto } from '../types';
import ProductCard from '../components/ProductCard';

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamada real al backend
    api.get<Producto[]>('/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-10">Cargando perfumes...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Catálogo Exclusivo
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map(prod => (
            <ProductCard key={prod.idProducto} producto={prod} />
          ))}
        </div>
      </div>
    </div>
  );
}