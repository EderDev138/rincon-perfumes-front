import { X, Package, Calendar, MapPin } from 'lucide-react';
import type { Pedido } from '../types';

interface Props {
  pedido: Pedido;
  onClose: () => void;
}

export default function OrdenDetalle({ pedido, onClose }: Props) {
  
  
  const listaDetalles = pedido.detalles || [];

  // Formateador de moneda
  const fmt = (valor: number) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);

  // Formateador de fecha
  const fecha = new Date(pedido.fechaPedido).toLocaleDateString('es-CL', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // control de error al iniciar pedido
  const totalCalculado = pedido.total > 0 
    ? pedido.total 
    : listaDetalles.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    
  const netoCalculado = pedido.subtotal > 0 
    ? pedido.subtotal 
    : Math.round(totalCalculado / 1.19);
    
  const ivaCalculado = pedido.iva > 0 
    ? pedido.iva 
    : totalCalculado - netoCalculado;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden border border-[#D4AF37]/30">
        
        {/* Header */}
        <div className="bg-[#1A1A1A] px-6 py-4 flex justify-between items-center border-b border-[#D4AF37]">
          <h3 className="text-xl font-serif text-[#D4AF37] flex items-center gap-2">
            <Package size={20} /> Pedido #{pedido.idPedido}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/*  Bodu*/}
        <div className="p-6 max-h-[70vh] overflow-y-auto bg-[#FDFBF7]">
          
          {/* Info del epedido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar size={16} className="text-[#D4AF37]" />
              <span className="font-semibold">Fecha:</span> {fecha}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <div className={`w-2 h-2 rounded-full ${pedido.estado === 'PENDIENTE' ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <span className="font-semibold">Estado:</span> {pedido.estado}
            </div>
            <div className="flex items-center gap-2 text-gray-700 col-span-2">
              <MapPin size={16} className="text-[#D4AF37]" />
              <span className="font-semibold">Envío a:</span> {pedido.direccionEnvio || "Dirección registrada"}
            </div>
          </div>

          {/* Tabla de Items */}
          <div className="border rounded-lg overflow-hidden mb-6 bg-white shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3 text-center">Cant.</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listaDetalles.length > 0 ? (
                  listaDetalles.map((det) => (
                    <tr key={det.idDetalle}>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {det.producto?.nombreProducto || "Producto desconocido"}
                        <p className="text-xs text-gray-500">{det.producto?.marca?.nombreMarca}</p>
                      </td>
                      <td className="px-4 py-3 text-center">{det.cantidad}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{fmt(det.precioUnitario)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        {fmt(det.precioUnitario * det.cantidad)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500 italic">
                      No hay detalles disponibles para este pedido.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Boleta */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Neto):</span>
                <span>{fmt(netoCalculado)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IVA (19%):</span>
                <span>{fmt(ivaCalculado)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-[#1A1A1A]">Total Pagado:</span>
                <span className="text-xl font-bold text-[#D4AF37]">{fmt(totalCalculado)}</span>
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer del Modal */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium text-sm transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}