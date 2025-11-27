import { useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import type{ Producto, Marca, Categoria, TipoProducto, Genero } from '../types';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function AdminProductos() {
  const { token } = useContext(AuthContext)!;
  
  // Estado de datos principales
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // Estados para listas desplegables (Dropdowns)
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tipos, setTipos] = useState<TipoProducto[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);

  // Estado del Modal y Edición
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Estado del Formulario
  const [form, setForm] = useState({
    nombreProducto: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    volumenML: 100,
    imagenUrl: '',
    idMarca: 0,
    idCategoria: 0,
    idTipoProducto: 0,
    idGenero: 0
  });

  // Cargar todos los datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resProd, resMarca, resCat, resTipo, resGen] = await Promise.all([
        api.get('/productos'),
        api.get('/marcas'),
        api.get('/categorias'),
        api.get('/tipos-producto'),
        api.get('/generos')
      ]);

      setProductos(resProd.data);
      setMarcas(resMarca.data);
      setCategorias(resCat.data);
      setTipos(resTipo.data);
      setGeneros(resGen.data);
    } catch (error) {
      console.error("Error cargando datos", error);
      toast.error("Error al cargar datos del servidor");
    }
  };

  // Manejar cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Preparar modal para crear
  const handleNew = () => {
    setForm({
      nombreProducto: '', descripcion: '', precio: 0, stock: 0, volumenML: 100, imagenUrl: '',
      idMarca: marcas[0]?.idMarca || 0,
      idCategoria: categorias[0]?.idCategoria || 0,
      idTipoProducto: tipos[0]?.idTipoProducto || 0,
      idGenero: generos[0]?.idGenero || 0
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Preparar modal para editar
  const handleEdit = (prod: Producto) => {
    setForm({
      nombreProducto: prod.nombreProducto,
      descripcion: prod.descripcion,
      precio: prod.precio,
      stock: prod.stock,
      volumenML: prod.volumenML,
      imagenUrl: prod.imagenUrl || '',
      idMarca: prod.marca.idMarca,
      idCategoria: prod.categoria.idCategoria,
      idTipoProducto: prod.tipoProducto.idTipoProducto,
      idGenero: prod.genero.idGenero
    });
    setCurrentId(prod.idProducto);
    setIsEditing(true);
    setShowModal(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Construir el objeto JSON tal como lo espera Java (anidado)
      const payload = {
        nombreProducto: form.nombreProducto,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        stock: Number(form.stock),
        volumenML: Number(form.volumenML),
        imagenUrl: form.imagenUrl,
        activo: true,
        // Relaciones: solo mandamos el ID dentro del objeto
        marca: { idMarca: Number(form.idMarca) },
        categoria: { idCategoria: Number(form.idCategoria) },
        tipoProducto: { idTipoProducto: Number(form.idTipoProducto) },
        genero: { idGenero: Number(form.idGenero) }
      };

      if (isEditing && currentId) {
        await api.put(`/productos/${currentId}`, payload);
        toast.success("Producto actualizado");
      } else {
        await api.post('/productos', payload);
        toast.success("Producto creado");
      }
      
      setShowModal(false);
      fetchData(); // Recargar tabla
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar producto");
    }
  };

  // Eliminar producto
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      toast.success("Producto eliminado");
      fetchData();
    } catch (error) {
      toast.error("No se pudo eliminar (posiblemente tiene pedidos asociados)");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Administrar Productos</h1>
        <button 
          onClick={handleNew}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca/Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((p) => (
                <tr key={p.idProducto} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover" src={p.imagenUrl || "https://via.placeholder.com/40"} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{p.nombreProducto}</div>
                        <div className="text-sm text-gray-500">{p.volumenML}ml</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{p.marca.nombreMarca}</div>
                    <div className="text-sm text-gray-500">{p.tipoProducto.nombreTipo} - {p.genero.nombreGenero}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${p.precio.toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.stock > 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                    <button onClick={() => handleDelete(p.idProducto)} className="text-red-600 hover:text-red-900">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (FORMULARIO) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input name="nombreProducto" value={form.nombreProducto} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>

                {/* Precio y Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <input type="number" name="precio" value={form.precio} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>

                {/* Volumen y Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Volumen (ml)</label>
                  <input type="number" name="volumenML" value={form.volumenML} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL Imagen</label>
                  <input type="text" name="imagenUrl" value={form.imagenUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>

                {/* Relaciones (Dropdowns) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Marca</label>
                  <select name="idMarca" value={form.idMarca} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    {marcas.map(m => <option key={m.idMarca} value={m.idMarca}>{m.nombreMarca}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <select name="idCategoria" value={form.idCategoria} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    {categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select name="idTipoProducto" value={form.idTipoProducto} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    {tipos.map(t => <option key={t.idTipoProducto} value={t.idTipoProducto}>{t.nombreTipo}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Género</label>
                  <select name="idGenero" value={form.idGenero} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    {generos.map(g => <option key={g.idGenero} value={g.idGenero}>{g.nombreGenero}</option>)}
                  </select>
                </div>

                {/* Descripción */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}