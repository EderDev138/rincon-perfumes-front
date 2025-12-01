// --- Sub-interfaces para las relaciones del Producto ---

export interface Marca {
  idMarca: number;
  nombreMarca: string;
  descripcion?: string;
  paisOrigen?: string;
}

export interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
  descripcion?: string;
}

export interface TipoProducto {
  idTipoProducto: number;
  nombreTipo: string;
  descripcion?: string;
}

export interface Genero {
  idGenero: number;
  nombreGenero: string;
}

// --- Interface Principal de Producto ---
// Coincide con ProductoEntidad.java del backend
export interface Producto {
  idProducto: number;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  volumenML: number;
  stock: number;
  imagenUrl?: string; 
  activo: boolean;
  
  // Relaciones (Objetos completos devueltos por la API)
  marca: Marca;
  categoria: Categoria;
  tipoProducto: TipoProducto;
  genero: Genero;

  // Campos opcionales
  aroma?: string;
  familiaOlfativa?: string;
}

// --- Interface de Item de Carrito ---
// Coincide con CarritoEntidad.java
export interface CarritoItem {
  id: number;          // ID de la fila en base de datos
  cantidad: number;
  producto: Producto;  // Objeto anidado
  
  // Campos opcionales para lógica frontend o auditoría
  fechaAgregado?: string;
  activo?: boolean;
  subtotal?: number;   // Calculado en el front para mostrar totales
}

// --- Interface de Usuario ---
// Coincide con UsuarioEntidad.java
export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;  
  activo: boolean;
}

// --- Interface
// --- Interface para respuesta de Login
export interface LoginResponse {
    mensaje: string;
    nombreUsuario: string;
    autenticado: boolean;
    token: string;
}

// --- Interface de Rol ---
// Coincide con RolEntidad.java
export interface Rol {
  idRol: number;
  nombreRol: string;
  descripcionRol?: string;
}

// Coincide con UsuarioEntidad.java
export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  activo: boolean;
  contrasena?: string; // Opcional, solo lo enviamos al crear/editar, el backend no siempre lo devuelve visible
  roles: Rol[];        
}