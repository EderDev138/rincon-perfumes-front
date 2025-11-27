import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import type { CarritoItem } from '../types'; // Importamos el tipo para el map

export default function Carrito() {
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!cartContext || !authContext) return null;

  const { items, total, removeFromCart, clearCart } = cartContext;
  const { user } = authContext;

  const handleCheckout = async () => {
    if (!user?.idUsuario || items.length === 0) return;

    try {
      // 1. Crear Pedido (Cabecera)
      const pedidoData = {
        cliente: { id: user.idUsuario },
        subtotal: total,
        iva: total * 0.19,
        total: total * 1.19,
        estado: "PENDIENTE",
        direccionEnvio: "Dirección del usuario", 
        fechaPedido: new Date().toISOString()
      };

      const resPedido = await api.post('/pedidos', pedidoData);
      const pedidoId = resPedido.data.id; 

      if (!pedidoId) throw new Error("No se recibió ID del pedido");

      // 2. Guardar Detalles
      const detallesPromesas = items.map((item: CarritoItem) => {
        return api.post('/detalles-pedido', {
          pedido: { id: pedidoId },
          producto: { idProducto: item.producto.idProducto },
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.producto.precio * item.cantidad
        });
      });

      await Promise.all(detallesPromesas);

      // 3. Vaciar y Redirigir
      await clearCart();
      navigate('/gracias', { state: { numeroOrden: pedidoId } });

    } catch (error) {
      console.error("Error al procesar la compra", error);
      alert("Hubo un error al procesar tu pedido.");
    }
  };

  // Renderizado si está vacío
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4">
          Tu carrito está vacío. ¡Ve al catálogo a buscar perfumes!
        </div>
        <Link 
          to="/catalogo" 
          className="inline-block border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded"
        >
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  // Renderizado principal
  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tu Carrito</h2>
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Subtotal
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: CarritoItem) => (
              <tr key={item.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {item.producto.nombreProducto}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    ${item.producto.precio.toLocaleString('es-CL')}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{item.cantidad}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-bold">
                    ${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-900 font-semibold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="px-5 py-5 border-b border-gray-200 bg-gray-50 text-right text-lg font-bold text-gray-800">
                Total Neto:
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-gray-50 text-lg font-bold text-blue-600">
                ${total.toLocaleString('es-CL')}
              </td>
              <td className="border-b border-gray-200 bg-gray-50"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={clearCart}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Vaciar Carrito
        </button>
        <button
          onClick={handleCheckout}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-lg transform hover:scale-105 transition-transform"
        >
          Confirmar Compra
        </button>
      </div>
    </div>
  );
}