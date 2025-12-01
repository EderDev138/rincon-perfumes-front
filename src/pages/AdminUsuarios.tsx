import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import type { Usuario, Rol } from '../types';
import { toast } from 'react-toastify';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [rolesDisponibles, setRolesDisponibles] = useState<Rol[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado del formulario
  const [form, setForm] = useState({
    idUsuario: 0,
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    activo: true,
    rolesSeleccionados: [] as number[] // Guardamos los IDs de los roles seleccionados
  });

  // 1. Cargar Usuarios y Roles al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resUsers, resRoles] = await Promise.all([
        api.get<Usuario[]>('/usuarios'),
        api.get<Rol[]>('/roles')
      ]);
      setUsuarios(resUsers.data);
      setRolesDisponibles(resRoles.data);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando lista de usuarios");
    }
  };

  // 2. Manejar apertura del modal (Nuevo vs Editar)
  const handleNew = () => {
    setForm({ 
      idUsuario: 0, nombre: '', apellido: '', correo: '', contrasena: '', activo: true, rolesSeleccionados: [] 
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (user: Usuario) => {
    setForm({
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      contrasena: '', // Dejamos vacío para no sobrescribir si no se cambia
      activo: user.activo,
      rolesSeleccionados: user.roles.map(r => r.idRol) // Mapeamos los roles que ya tiene
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // 3. Guardar cambios
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Construimos el objeto UsuarioEntidad con sus Roles anidados
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        activo: form.activo,
        // Solo enviamos contraseña si se escribió algo (para evitar enviar strings vacíos en edición)
        ...(form.contrasena ? { contrasena: form.contrasena } : {}),
        // Mapeamos los IDs seleccionados a objetos RolEntidad
        roles: form.rolesSeleccionados.map(id => ({ idRol: id }))
      };

      if (isEditing) {
        
        const usuarioOriginal = usuarios.find(u => u.idUsuario === form.idUsuario);
        const payloadEditar = {
            ...payload,
            contrasena: form.contrasena || usuarioOriginal?.contrasena || "" // Fallback
        };
        await api.put(`/usuarios/${form.idUsuario}`, payloadEditar);
        toast.success("Usuario actualizado");
      } else {
        if(!form.contrasena) return toast.warning("La contraseña es obligatoria para nuevos usuarios");
        await api.post('/usuarios', payload);
        toast.success("Usuario creado");
      }

      setShowModal(false);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error("Error al guardar usuario");
    }
  };

  // 4. Eliminar Usuario
  const handleDelete = async (id: number) => {
    if(!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      toast.success("Usuario eliminado");
      fetchData();
    } catch (error) {
      toast.error("No se pudo eliminar");
    }
  };

  // Helper para checkboxes de roles
  const toggleRole = (idRol: number) => {
    setForm(prev => {
      const selected = prev.rolesSeleccionados.includes(idRol)
        ? prev.rolesSeleccionados.filter(id => id !== idRol) // Quitar
        : [...prev.rolesSeleccionados, idRol]; // Agregar
      return { ...prev, rolesSeleccionados: selected };
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button onClick={handleNew} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map(user => (
              <tr key={user.idUsuario}>
                <td className="px-6 py-4 text-sm text-gray-900">{user.nombre} {user.apellido}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.correo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.roles.map(r => (
                    <span key={r.idRol} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                      {r.nombreRol}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                  <button onClick={() => handleDelete(user.idUsuario)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellido</label>
                  <input required value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded p-2" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo</label>
                <input type="email" required value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña {isEditing && <span className="text-xs text-gray-500">(Dejar en blanco para mantener actual)</span>}
                </label>
                <input type="password" value={form.contrasena} onChange={e => setForm({...form, contrasena: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                <div className="space-y-2">
                  {rolesDisponibles.map(rol => (
                    <label key={rol.idRol} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={form.rolesSeleccionados.includes(rol.idRol)}
                        onChange={() => toggleRole(rol.idRol)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{rol.nombreRol}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={form.activo} 
                  onChange={e => setForm({...form, activo: e.target.checked})}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Usuario Activo</label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}