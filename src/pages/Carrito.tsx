import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import type { CarritoItem } from '../types';
// Agregamos toast para feedback visual si no lo tenías importado
import { toast } from 'react-toastify'; 

export default function Carrito() {
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!cartContext || !authContext) return null;

  // Extraemos isAuthenticated del AuthContext
  const { items, total, removeFromCart, clearCart, clienteId } = cartContext;
  const { isAuthenticated } = authContext; // Solo necesitamos saber si está autenticado

  // reglas de promocion
  const MONTO_MINIMO_DESCUENTO = 59990;
  const TASA_DESCUENTO = 0.10; // 10%

  // --- CÁLCULOS ---
  const aplicaDescuento = total > MONTO_MINIMO_DESCUENTO;
  const montoDescuento = aplicaDescuento ? Math.round(total * TASA_DESCUENTO) : 0;
  const subtotalConDescuento = total - montoDescuento;
  const iva = Math.round(subtotalConDescuento * 0.19);
  const totalFinal = Math.round(subtotalConDescuento + iva);

  const handleCheckout = async () => {
    // 1. NUEVA VALIDACIÓN: Si es invitado, mandar a Login
    if (!isAuthenticated) {
        toast.info("Para finalizar tu compra, por favor inicia sesión o regístrate.");
        navigate('/login'); 
        return;
    }

    // 2. Validación de seguridad (si está logueado pero falla la carga de perfil)
    if (!clienteId) {
      toast.error("Error: No se pudo identificar tu perfil de cliente.");
      return;
    }

    if (items.length === 0) {
      toast.warn("El carrito está vacío.");
      return;
    }

    try {
      const now = new Date();
      const fechaLocal = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
                         .toISOString()
                         .slice(0, 19); 

      const pedidoPayload = {
        cliente: { id: Number(clienteId) }, 
        fechaPedido: fechaLocal,          
        subtotal: total,
        descuento: montoDescuento,
        iva: iva,
        total: totalFinal,
        estado: "PENDIENTE",
        direccionEnvio: "Dirección Principal", // Podrías mejorar esto con un form
        comunaEnvio: "Santiago",               
        regionEnvio: "Metropolitana",         
        numeroSeguimiento: ""                  
      };

      console.log("📦 Enviando Pedido:", pedidoPayload);

      const resPedido = await api.post('/pedidos', pedidoPayload);
      const pedidoId = resPedido.data?.id || resPedido.data?.idPedido;

      if (!pedidoId) throw new Error("El pedido se creó pero no tiene ID.");

      const detallesPromesas = items.map((item: CarritoItem) => {
        return api.post('/detalles-pedido', {
          pedido: { id: pedidoId },
          producto: { idProducto: item.producto.idProducto },
          cantidad: Number(item.cantidad),
          precioUnitario: Number(item.producto.precio),
          subtotal: Number(item.producto.precio * item.cantidad),
          descuentoAplicado: 0 
        });
      });

      await Promise.all(detallesPromesas);
      await clearCart();
      navigate('/gracias', { state: { numeroOrden: pedidoId } });

    } catch (error: any) {
      console.error("🔥 Error al comprar:", error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error;
      toast.error(`Error al procesar el pedido: ${serverMsg || "Intenta nuevamente"}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4">
          Tu carrito está vacío.
        </div>
        <Link to="/catalogo" className="inline-block border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-2 px-4 rounded transition-colors">
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen bg-[#FDFBF7]">
      <h2 className="text-3xl font-serif font-bold mb-8 text-[#1A1A1A]">Tu Carrito de Compras</h2>
      
      {/* Tabla de items (Igual que antes) */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-[#D4AF37]/20">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Cant.</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Subtotal</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: CarritoItem) => (
              <tr key={item.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">{item.producto.nombreProducto}</p>
                      <p className="text-gray-500 text-xs">{item.producto.marca.nombreMarca}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  ${item.producto.precio.toLocaleString('es-CL')}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  {item.cantidad}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right font-bold text-gray-700">
                  ${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs uppercase">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          
          <tfoot className="bg-gray-50">
            {/* Subtotal */}
            <tr>
              <td colSpan={3} className="px-5 py-2 text-right text-sm text-gray-600">Subtotal:</td>
              <td className="px-5 py-2 text-right text-sm font-medium text-gray-800">
                ${total.toLocaleString('es-CL')}
              </td>
              <td></td>
            </tr>

            {/* Descuento */}
            {aplicaDescuento && (
              <tr>
                <td colSpan={3} className="px-5 py-2 text-right text-sm text-green-600 font-medium">
                  Descuento (10%):
                </td>
                <td className="px-5 py-2 text-right text-sm font-medium text-green-600">
                  - ${montoDescuento.toLocaleString('es-CL')}
                </td>
                <td></td>
              </tr>
            )}
            
            {/* IVA */}
            <tr>
              <td colSpan={3} className="px-5 py-2 text-right text-sm text-gray-600 border-b border-gray-200">IVA (19%):</td>
              <td className="px-5 py-2 text-right text-sm font-medium text-gray-800 border-b border-gray-200">
                ${iva.toLocaleString('es-CL')}
              </td>
              <td className="border-b border-gray-200"></td>
            </tr>

            {/* Total */}
            <tr className="bg-[#1A1A1A] text-white">
              <td colSpan={3} className="px-5 py-4 text-right text-lg font-bold">
                TOTAL A PAGAR:
              </td>
              <td className="px-5 py-4 text-right text-xl font-bold text-[#D4AF37]">
                ${totalFinal.toLocaleString('es-CL')}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={clearCart}
          className="px-6 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium rounded transition-colors"
        >
          Vaciar Carrito
        </button>
        <button
          onClick={handleCheckout}
          className="px-8 py-3 bg-[#D4AF37] hover:bg-[#AA8C2C] text-white font-bold rounded shadow-lg transform hover:scale-105 transition-all"
        >
          {isAuthenticated ? 'Confirmar Compra' : 'Iniciar Sesión para Comprar'}
        </button>
      </div>
    </div>
  );
}