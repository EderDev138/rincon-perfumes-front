import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import api from '../../api/axiosConfig'; // Importamos la api para mockearla

// --- MOCKS ---

// Mock de la API (Axios)
vi.mock('../../api/axiosConfig', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

// Mock de React Toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }
}));

// Mock de React Router (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Página: Login', () => {
  
  // Spies (Espías) para las funciones del contexto
  const mockLogin = vi.fn();
  const mockSyncGuestCart = vi.fn();

  // Función Helper para renderizar con todos los Contextos necesarios
  const renderLogin = () => {
    return render(
      <AuthContext.Provider value={{ 
        login: mockLogin, 
        user: null, 
        token: null, 
        logout: vi.fn(), 
        isAuthenticated: false, 
        isAdmin: false, 
        loading: false 
      }}>
        <CartContext.Provider value={{ 
          syncGuestCart: mockSyncGuestCart, 
          items: [], 
          total: 0, 
          count: 0, 
          clienteId: null, 
          addToCart: vi.fn(), 
          removeFromCart: vi.fn(), 
          clearCart: vi.fn() 
        }}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('debe llamar a login() y sincronizar carrito al tener éxito', async () => {
    renderLogin();
    
    // Configurar Inputs
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), { target: { value: 'juan@test.cl' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: 'password123' } });
    
    // --- Mockear Comportamientos ---
    // 1. Login exitoso
    mockLogin.mockResolvedValue(true);
    
    // 2. Respuestas de la API para la sincronización de carrito
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/usuarios') {
        return Promise.resolve({ data: [{ idUsuario: 1, correo: 'juan@test.cl' }] });
      }
      if (url === '/clientes') {
        return Promise.resolve({ data: [{ id: 99, usuario: { idUsuario: 1 } }] });
      }
      return Promise.resolve({ data: [] });
    });

    // Acción: Click en Ingresar
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    // Verificación
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('juan@test.cl', 'password123');
      // Verificamos que intentó buscar los datos del usuario para el carrito
      expect(api.get).toHaveBeenCalledWith('/usuarios');
      // Verificamos que se llamó a la sincronización con el ID del cliente (99)
      expect(mockSyncGuestCart).toHaveBeenCalledWith(99);
      // Verificamos redirección
      expect(mockNavigate).toHaveBeenCalledWith('/catalogo');
    });
  });

  it('debe mostrar confirmación y redirigir a registro si el correo no existe', async () => {
    renderLogin();
    
    // 1. Simular error de "Correo no registrado"
    mockLogin.mockRejectedValue(new Error('Error: Correo no registrado en el sistema'));
    
    // 2. Espiar y mockear window.confirm para que devuelva "true" (Aceptar)
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), { target: { value: 'nuevo@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: '123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(confirmSpy).toHaveBeenCalled(); // Se abrió la ventana de confirmación
      expect(mockNavigate).toHaveBeenCalledWith('/registro'); // Se fue al registro
    });
  });
});