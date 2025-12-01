import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import type { CarritoItem, Producto } from '../types';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

interface CartContextType {
  items: CarritoItem[];
  total: number;
  count: number;
  clienteId: number | null;
  addToCart: (producto: Producto) => Promise<void>;
  removeFromCart: (idCarritoOrProductoId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncGuestCart: (clienteId: number) => Promise<void>; // Nueva función
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext)!;
  const [items, setItems] = useState<CarritoItem[]>([]);
  const [clienteId, setClienteId] = useState<number | null>(null);

  // 1. Cargar Cliente ID si está autenticado
  useEffect(() => {
    const buscarClienteId = async () => {
      if (isAuthenticated && user?.idUsuario) {
        try {
          const res = await api.get('/clientes');
          const miCliente = res.data.find((c: any) => c.usuario.idUsuario === user.idUsuario);
          if (miCliente) {
            setClienteId(miCliente.id);
          }
        } catch (error) {
          console.error("Error buscando perfil de cliente:", error);
        }
      } else {
        setClienteId(null);
        // Si no está autenticado, cargar del LocalStorage
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
            setItems(JSON.parse(localCart));
        } else {
            setItems([]);
        }
      }
    };
    buscarClienteId();
  }, [isAuthenticated, user]);

  // 2. Cargar carrito del backend cuando tenemos clienteId
  useEffect(() => {
    if (clienteId) {
      fetchCart(clienteId);
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

  // --- LOGICA HÍBRIDA AGREGAR ---
  const addToCart = async (producto: Producto) => {
    // A. FLUJO USUARIO LOGUEADO (BACKEND)
    if (isAuthenticated && clienteId) {
      try {
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
    } 
    // B. FLUJO INVITADO (LOCALSTORAGE)
    else {
        const currentItems = [...items];
        // Buscamos si ya existe el producto en el array local por ID de producto
        const existingIndex = currentItems.findIndex(i => i.producto.idProducto === producto.idProducto);

        if (existingIndex >= 0) {
            currentItems[existingIndex].cantidad += 1;
        } else {
            // Creamos un item simulado
            const newItem: CarritoItem = {
                id: Date.now(), // ID temporal
                cantidad: 1,
                producto: producto
            };
            currentItems.push(newItem);
        }
        
        setItems(currentItems);
        localStorage.setItem('guest_cart', JSON.stringify(currentItems));
        toast.success("Agregado al carrito (Local)");
    }
  };

  // --- LOGICA HÍBRIDA ELIMINAR ---
  const removeFromCart = async (idIdentifier: number) => {
    if (isAuthenticated && clienteId) {
        // idIdentifier es el ID de la tabla carrito
        try {
            await api.delete(`/carrito/${idIdentifier}`);
            await fetchCart(clienteId);
            toast.info("Producto eliminado");
        } catch (error) {
            console.error(error);
        }
    } else {
        // idIdentifier es el ID temporal o ID del item en el array
        const newItems = items.filter(item => item.id !== idIdentifier);
        setItems(newItems);
        localStorage.setItem('guest_cart', JSON.stringify(newItems));
        toast.info("Producto eliminado");
    }
  };

  // --- LOGICA HÍBRIDA VACIAR ---
  const clearCart = async () => {
    if (isAuthenticated && clienteId) {
        try {
            await api.delete(`/carrito/vaciar/${clienteId}`);
            setItems([]);
        } catch (error) {
            console.error(error);
        }
    } else {
        setItems([]);
        localStorage.removeItem('guest_cart');
    }
  };

  // --- NUEVA FUNCIÓN: SINCRONIZAR ---
  // Esta función se llamará justo después del Login exitoso
  const syncGuestCart = async (idCliente: number) => {
      const localCart = localStorage.getItem('guest_cart');
      if (localCart) {
          const guestItems: CarritoItem[] = JSON.parse(localCart);
          
          if (guestItems.length > 0) {
              toast.info("Sincronizando tu carrito...");
              // Enviamos cada item local al backend
              const promises = guestItems.map(item => {
                  return api.post('/carrito', {
                      cliente: { id: idCliente },
                      producto: { idProducto: item.producto.idProducto },
                      cantidad: item.cantidad
                  });
              });

              try {
                  await Promise.all(promises);
                  localStorage.removeItem('guest_cart'); // Limpiamos local
                  await fetchCart(idCliente); // Recargamos del backend
                  toast.success("Carrito sincronizado");
              } catch (error) {
                  console.error("Error sincronizando carrito", error);
              }
          }
      }
  };

  const total = items.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  const count = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, total, count, clienteId, addToCart, removeFromCart, clearCart, syncGuestCart }}>
      {children}
    </CartContext.Provider>
  );
};