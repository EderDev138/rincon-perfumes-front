import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { Info, AlertCircle, CheckCircle } from 'lucide-react'; // Iconos

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Estado para errores de validación
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  // Regex para Email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    
    if (name === 'email') {
      if (!emailRegex.test(value)) errorMsg = 'Ingresa un correo válido (ej: usuario@mail.com)';
    }
    if (name === 'password') {
      if (value.length < 6) errorMsg = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (name === 'rut') {
      if (value.length < 8) errorMsg = 'El RUT parece muy corto';
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todo antes de enviar
    if (!emailRegex.test(form.email) || form.password.length < 6) {
      toast.error("Por favor corrige los errores antes de continuar.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        rut: form.rut,
        primerNombre: form.primerNombre,
        primerApellido: form.primerApellido,
        fechaNacimiento: form.fechaNacimiento,
        telefono: form.telefono,
        direccion: form.direccion,
        comuna: form.comuna,
        region: form.region,
        usuario: {
          nombre: form.primerNombre,
          apellido: form.primerApellido,
          correo: form.email,
          contrasena: form.password,
          activo: true
        }
      };

      await api.post('/clientes', payload);
      toast.success("¡Registro exitoso! Bienvenido a Rincón Perfumes.");
      navigate('/login');

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.mensaje || "Error al registrarse.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Clases comunes para inputs
  const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors outline-none";
  const errorInputClass = "mt-1 block w-full border border-red-500 rounded-md shadow-sm p-2 focus:ring-red-500 outline-none bg-red-50";

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-xl border-t-4 border-[#D4AF37]">
        <h2 className="text-3xl font-serif font-bold text-center text-[#1A1A1A] mb-2">Crear Cuenta</h2>
        <p className="text-center text-gray-500 mb-8">Únete a nuestro club exclusivo de fragancias.</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
          
          {/* --- Sección Personal --- */}
          <div className="col-span-2 border-b pb-2 mb-2">
            <h3 className="text-lg font-medium text-[#D4AF37]">Información Personal</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">RUT</label>
            <input name="rut" onChange={handleChange} className={inputClass} placeholder="12345678-9" required />
            <p className="text-xs text-gray-400 mt-1">Sin puntos, con guion.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input type="date" name="fechaNacimiento" onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input name="primerNombre" onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input name="primerApellido" onChange={handleChange} className={inputClass} required />
          </div>

          {/* --- Sección Contacto --- */}
          <div className="col-span-2 border-b pb-2 mb-2 mt-4">
            <h3 className="text-lg font-medium text-[#D4AF37]">Contacto y Envío</h3>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input name="direccion" onChange={handleChange} className={inputClass} placeholder="Calle, número, depto..." />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Comuna</label>
            <input name="comuna" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input name="telefono" onChange={handleChange} className={inputClass} placeholder="+56 9..." />
          </div>

          {/* --- Sección Cuenta --- */}
          <div className="col-span-2 border-b pb-2 mb-2 mt-4">
            <h3 className="text-lg font-medium text-[#D4AF37]">Datos de Acceso</h3>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <div className="relative">
              <input 
                type="email" 
                name="email" 
                onChange={handleChange} 
                className={errors.email ? errorInputClass : inputClass} 
                placeholder="ejemplo@correo.com"
                required 
              />
              {/* Icono de validación visual */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {form.email && !errors.email && <CheckCircle className="h-5 w-5 text-green-500" />}
                {errors.email && <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
            </div>
            {/* Texto de error o ayuda */}
            {errors.email ? (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Info size={12}/> Usaremos este correo para enviarte tus pedidos.
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              onChange={handleChange} 
              className={errors.password ? errorInputClass : inputClass}
              required 
            />
            {errors.password ? (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres.</p>
            )}
          </div>

          <div className="col-span-2 pt-6">
            <button
              type="submit"
              disabled={loading || Object.values(errors).some(x => x !== "")}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-none shadow-md text-sm font-bold uppercase tracking-wider text-white bg-[#D4AF37] hover:bg-[#AA8C2C] focus:outline-none transition-all duration-300 transform hover:scale-[1.01]"
            >
              {loading ? 'Procesando...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-[#D4AF37] hover:text-[#AA8C2C] transition-colors">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}