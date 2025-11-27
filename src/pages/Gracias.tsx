import { useLocation, Link, Navigate } from 'react-router-dom';

export default function Gracias() {
  const location = useLocation();
  const state = location.state as { numeroOrden?: number } | null;
  const numeroOrden = state?.numeroOrden;

  if (!numeroOrden) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-2xl text-center">
        
        {/* Icono de Éxito Animado */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
          <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          ¡Gracias por tu compra!
        </h2>
        
        <p className="text-gray-500 mb-8">
          Tu pedido ha sido procesado exitosamente. Hemos enviado un correo de confirmación con los detalles.
        </p>

        {/* Tarjeta con el Número de Orden */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
            Número de Pedido
          </p>
          <p className="text-4xl font-mono font-bold text-gray-800 mt-2">
            #{numeroOrden}
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-3">
          <Link 
            to="/catalogo" 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
          >
            Seguir Comprando
          </Link>
          
          <Link 
            to="/" 
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
        
      </div>
    </div>
  );
}