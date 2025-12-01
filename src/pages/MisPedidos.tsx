import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import type { Pedido } from '../types';
import OrdenDetalle from '../components/OrdenDetalle';
import { ShoppingBag, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MisPedidos() {
  const { user } = useContext(AuthContext)!;
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user) return;
      try {
        // get para id de clientes
        const resClientes = await api.get('/clientes');
        const miCliente = resClientes.data.find((c: any) => c.usuario.idUsuario === user.idUsuario);

        if (miCliente) {
          // get de pedidos
          const resPedidos = await api.get('/pedidos');
          // Filtrar en frontend
          const misPedidos = resPedidos.data.filter((p: any) => p.cliente.id === miCliente.id);
          
          // Ordenar: más recientes primero
          misPedidos.sort((a: any, b: any) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
          
          setPedidos(misPedidos);
        }
      } catch (error) {
        console.error("Error cargando pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#D4AF37] font-serif">Cargando historial...</div>;

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* titulo */}
        <div className="mb-8 border-b border-[#D4AF37]/30 pb-4">
          <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] flex items-center gap-3">
            <ShoppingBag className="text-[#D4AF37]" /> Mis Pedidos
          </h1>
          <p className="text-gray-500 mt-2">Historial de tus compras exclusivas.</p>
        </div>

        {/* listado de pedidos */}
        {pedidos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-4">Aún no has realizado ninguna compra.</p>
            <Link to="/catalogo" className="px-6 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#AA8C2C]">
              Ir al Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div 
                key={pedido.idPedido} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-center gap-4"
              >
                {/* informacion */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-[#1A1A1A]">Pedido #{pedido.idPedido}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                      pedido.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 
                      pedido.estado === 'ENVIADO' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {pedido.estado}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> 
                      {new Date(pedido.fechaPedido).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    {/* validaciones de nullcontroller */}
                    <span>{pedido.detalles?.length || 0} productos</span>
                  </div>
                </div>

                {/*total de lista */}
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Compra</p>
                  <p className="text-xl font-bold text-[#D4AF37]">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(pedido.total)}
                  </p>
                </div>

                {/* Botón Acción */}
                <button
                  onClick={() => setSelectedOrder(pedido)}
                  className="px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Eye size={16} /> Ver Detalle
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Renderizar Modal si hay un pedido seleccionado */}
      {selectedOrder && (
        <OrdenDetalle 
          pedido={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}