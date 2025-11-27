import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import type { CarritoItem, Producto } from '../types';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

interface CartContextType {
  items: CarritoItem[];
  total: number;
  count: number;
  clienteId: number | null; // <--- NUEVO CAMPO
  addToCart: (producto: Producto) => Promise<void>;
  removeFromCart: (idCarrito: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext)!;
  const [items, setItems] = useState<CarritoItem[]>([]);
  // Nuevo estado para guardar el ID real de la tabla 'clientes'
  const [clienteId, setClienteId] = useState<number | null>(null);

  // 1. Efecto para encontrar el ID de Cliente del usuario actual
  useEffect(() => {
    const buscarClienteId = async () => {
      if (isAuthenticated && user?.idUsuario) {
        try {
          // Obtenemos todos los clientes y buscamos el que corresponde a nuestro usuario
          
          const res = await api.get('/clientes');
          //Ojo El backend devuelve 'usuario' dentro de cliente con sus datos
          const miCliente = res.data.find((c: any) => c.usuario.idUsuario === user.idUsuario);

          if (miCliente) {
            setClienteId(miCliente.id);
          } else {
            console.warn("El usuario logueado no tiene perfil de cliente (quizás es solo Admin).");
            setClienteId(null);
          }
        } catch (error) {
          console.error("Error buscando perfil de cliente:", error);
        }
      } else {
        setClienteId(null);
        setItems([]);
      }
    };

    buscarClienteId();
  }, [isAuthenticated, user]);

  // 2. Efecto para cargar el carrito una vez que tenemos el clienteId
  useEffect(() => {
    if (clienteId) {
      fetchCart(clienteId);
    } else {
      setItems([]);
    }
  }, [clienteId]);

  const fetchCart = async (id: number) => {
    try {
      const res = await api.get(`/carrito/cliente/${id}`);
      setItems(res.data);
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
  };

  const addToCart = async (producto: Producto) => {
    if (!isAuthenticated) {
        toast.error("Debes iniciar sesión");
        return;
    }
    if (!clienteId) {
      toast.error("Tu usuario no tiene perfil de cliente habilitado para compras.");
      return;
    }

    try {
      // Usamos clienteId (ID de tabla clientes) en lugar de user.idUsuario
      await api.post('/carrito', {
        cliente: { id: clienteId }, 
        producto: { idProducto: producto.idProducto },
        cantidad: 1
      });
      toast.success("Agregado al carrito");
      await fetchCart(clienteId);
    } catch (error) {
      console.error("Error al agregar:", error);
      toast.error("Error al conectar con el servidor.");
    }
  };

  const removeFromCart = async (idCarrito: number) => {
    if (!clienteId) return;
    try {
      await api.delete(`/carrito/${idCarrito}`);
      await fetchCart(clienteId);
      toast.info("Producto eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const clearCart = async () => {
    if (!clienteId) return;
    try {
      await api.delete(`/carrito/vaciar/${clienteId}`);
      setItems([]);
      toast.info("Carrito vaciado");
    } catch (error) {
      console.error("Error al vaciar:", error);
    }
  };

  const total = items.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  const count = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, total, count,clienteId, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};