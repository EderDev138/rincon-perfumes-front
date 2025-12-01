import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../../components/ProductCard';
import { CartContext } from '../../context/CartContext';
import type { Producto } from '../../types';


// Creamos un producto "dummy" para las pruebas
const mockProducto: Producto = {
  idProducto: 1,
  nombreProducto: 'Perfume Test',
  descripcion: 'Descripcion de prueba',
  precio: 50000,
  volumenML: 100,
  stock: 10,
  imagenUrl: 'http://test.jpg',
  activo: true,
  marca: { idMarca: 1, nombreMarca: 'Marca Test' },
  categoria: { idCategoria: 1, nombreCategoria: 'Categoria Test' },
  tipoProducto: { idTipoProducto: 1, nombreTipo: 'EDP' },
  genero: { idGenero: 1, nombreGenero: 'Unisex' }
};


// ProductCard necesita CartContext para la función addToCart
const renderCard = (producto: Producto, addToCartMock = vi.fn()) => {
  return render(
    <CartContext.Provider value={{ 
      items: [], 
      total: 0, 
      count: 0, 
      clienteId: null, 
      addToCart: addToCartMock, 
      removeFromCart: vi.fn(), 
      clearCart: vi.fn(),
      syncGuestCart: vi.fn()
    }}>
      <ProductCard producto={producto} />
    </CartContext.Provider>
  );
};

describe('Componente: ProductCard', () => {

  it('debe mostrar la información del producto correctamente', () => {
    renderCard(mockProducto);

    // Verificar Nombre
    expect(screen.getByText('Perfume Test')).toBeInTheDocument();
    
    // Verificar Marca 
    expect(screen.getByText('Marca Test')).toBeInTheDocument();
    
    // Verificar Precio formateado (Intl puede variar por locale, buscamos parte del texto)
    // $50.000
    const precio = screen.getByText((content) => content.includes('50.000'));
    expect(precio).toBeInTheDocument();
  });

  it('debe llamar a addToCart cuando hay stock y se hace click', () => {
    const addToCartMock = vi.fn();
    renderCard(mockProducto, addToCartMock);

    // Buscar el botón
    const boton = screen.getByRole('button', { name: /agregar/i });
    
    // El botón debe estar habilitado
    expect(boton).toBeEnabled();

    // Hacer Click
    fireEvent.click(boton);

    // Verificar que se llamó a la función con el producto correcto
    expect(addToCartMock).toHaveBeenCalledTimes(1);
    expect(addToCartMock).toHaveBeenCalledWith(mockProducto);
  });

  it('debe deshabilitar el botón si el stock es 0', () => {
    // Creamos una variante sin stock
    const productoSinStock = { ...mockProducto, stock: 0 };
    
    renderCard(productoSinStock);

    const boton = screen.getByRole('button');

    // Debe decir "Agotado" y estar deshabilitado
    expect(boton).toHaveTextContent(/agotado/i);
    expect(boton).toBeDisabled();
  });

  it('debe manejar imágenes rotas o faltantes (fallback)', () => {
    // Producto sin URL de imagen
    const productoSinImagen = { ...mockProducto, imagenUrl: '' };
    renderCard(productoSinImagen);

    const imagen = screen.getByRole('img');
    // Verificamos que use el placeholder
    expect(imagen).toHaveAttribute('src', expect.stringContaining('placehold.co'));
  });
});