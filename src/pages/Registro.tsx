import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estado inicial basado en ClienteEntidad.java
  const [form, setForm] = useState({
    rut: '',
    primerNombre: '',
    primerApellido: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Construimos el payload JSON anidado que espera Spring Boot
      // ClienteEntidad tiene una relación OneToOne con UsuarioEntidad
      const payload = {
        rut: form.rut,
        primerNombre: form.primerNombre,
        primerApellido: form.primerApellido,
        fechaNacimiento: form.fechaNacimiento,
        telefono: form.telefono,
        direccion: form.direccion,
        comuna: form.comuna,
        region: form.region,
        // Objeto Usuario anidado
        usuario: {
          nombre: form.primerNombre, // Reutilizamos nombre para usuario
          apellido: form.primerApellido,
          correo: form.email,
          contrasena: form.password,
          activo: true
        }
      };

      // POST al endpoint público de clientes
      await api.post('/clientes', payload);
      
      toast.success("¡Registro exitoso! Ahora puedes iniciar sesión.");
      navigate('/login');

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.mensaje || "Error al registrarse. Verifica los datos.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          
          {/* Datos Personales */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700">RUT</label>
            <input name="rut" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="12345678-9" />
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input type="date" name="fechaNacimiento" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Primer Nombre</label>
            <input name="primerNombre" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Primer Apellido</label>
            <input name="primerApellido" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          {/* Datos de Contacto */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input name="direccion" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Comuna</label>
            <input name="comuna" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
           <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input name="telefono" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          {/* Datos de Cuenta (Usuario) */}
          <div className="col-span-2 border-t pt-4 mt-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Datos de Acceso</h3>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input type="email" name="email" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" name="password" required minLength={6} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div className="col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}