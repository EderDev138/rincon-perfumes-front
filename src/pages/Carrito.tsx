import { useContext } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Carrito() {
  const { items, total, removeFromCart, clearCart } = useContext(CartContext)!;
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user || items.length === 0) return;

    try {
      // 1. Crear el Pedido (Cabecera)
      // Nota: El backend calcula IVA y totales usualmente, pero aquí enviamos lo básico
      // para que se guarde.
      const pedidoData = {
        cliente: { id: user.idUsuario },
        subtotal: total,
        iva: total * 0.19,
        total: total * 1.19,
        estado: "PENDIENTE",
        direccionEnvio: "Dirección registrada del cliente", // Podrías pedirla en un form previo
        fechaPedido: new Date().toISOString()
      };

      const resPedido = await api.post('/pedidos', pedidoData);
      const pedidoId = resPedido.data.id;

      // 2. Guardar cada detalle del pedido
      // Iteramos sobre los items del carrito y los guardamos como detalles
      const detallesPromesas = items.map(item => {
        return api.post('/detalles-pedido', {
          pedido: { id: pedidoId },
          producto: { idProducto: item.producto.idProducto },
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.producto.precio * item.cantidad
        });
      });

      await Promise.all(detallesPromesas);

      // 3. Vaciar el carrito en el backend
      await clearCart();

      // 4. Redirigir a página de éxito
      navigate('/gracias', { state: { numeroOrden: pedidoId } });

    } catch (error) {
      console.error("Error al procesar la compra", error);
      alert("Hubo un error al procesar tu pedido.");
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">Tu carrito está vacío. ¡Ve al catálogo a buscar perfumes!</Alert>
        <Button href="/catalogo" variant="outline-primary">Ir al Catálogo</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2>Tu Carrito</h2>
      <Table responsive hover className="mt-4">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.producto.nombreProducto}</td>
              <td>${item.producto.precio.toLocaleString('es-CL')}</td>
              <td>{item.cantidad}</td>
              <td>${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
            <tr>
                <td colSpan={3} className="text-end fw-bold">Total Neto:</td>
                <td className="fw-bold">${total.toLocaleString('es-CL')}</td>
                <td></td>
            </tr>
        </tfoot>
      </Table>
      
      <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="secondary" onClick={clearCart}>Vaciar Carrito</Button>
          <Button variant="success" size="lg" onClick={handleCheckout}>Confirmar Compra</Button>
      </div>
    </Container>
  );
}