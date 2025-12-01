

---

# 🛍️ Rincón Perfumes – Frontend

**E-commerce moderno para la venta de perfumes**, desarrollado con **React 19**, **Vite** y **TypeScript**, implementando un sistema híbrido de carrito (invitado/cliente), autenticación JWT, interfaz responsiva y una experiencia de compra optimizada.

**Elaborado por:** *Eder Valdivia* y *Leonardo Amundarain*.

---

## 📦 Stack Tecnológico

| Categoría         | Tecnologías                                  |
| ----------------- | -------------------------------------------- |
| **Core**          | React 19, TypeScript, Vite                   |
| **Routing**       | React Router DOM v7                          |
| **Estado**        | React Context API (AuthContext, CartContext) |
| **HTTP Client**   | Axios                                        |
| **Autenticación** | JWT + jwt-decode                             |
| **UI & Estilos**  | Tailwind CSS v4, shadcn/ui, lucide-react     |
| **Utilidades**    | clsx, tailwind-merge, cva                    |
| **Testing**       | Vitest, React Testing Library, JSDOM         |

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

* **Node.js 18+**
* **npm**

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd rincon-perfumes-front
```

---

### 2️⃣ Instalar dependencias

```bash
npm install
```

> Esto incluye React, Vite, Tailwind, Axios, React Router DOM, JWT decode, React Toastify y todas las herramientas de Testing.

---

### 3️⃣ Configuración del entorno (Opcional)

Actualmente la URL base del backend se define en:

```
src/api/axiosConfig.ts
```

Por defecto apunta a:

```
http://localhost:8080/api
```

Si tu backend utiliza otra ruta, actualiza ese archivo o añade soporte con variables `.env`.

---

## 🛠️ Scripts del Proyecto

### ▶️ Servidor de desarrollo

```bash
npm run dev
```

La app estará disponible usualmente en:

```
http://localhost:5173
```

---

### 🏗️ Build para producción

```bash
npm run build
```

Generará la carpeta optimizada:

```
/dist
```

---

## 🧪 Pruebas Unitarias (Vitest)

Ejecución de todos los tests:

```bash
npm run test
```

**Incluye:**

* Validación de componentes
* Tests de utilidades
* Flujos (login, carrito, navegación)

🔧 Tecnologías de Testing:

* **Vitest**: Motor rápido integrado en Vite
* **JSDOM**: Simulación de DOM para Node
* **Testing Library**: Interacción realista con componentes

---

## 🎨 Estilos y UI (Tailwind + shadcn/ui)

Este proyecto utiliza:

* **Tailwind CSS v4** → Estilos utilitarios modernos
* **shadcn/ui** → Arquitectura de componentes reutilizables
* **lucide-react** → Iconografía
* **cva** y **tailwind-merge** → Variantes y manejo avanzado de clases
* **react-toastify** → Notificaciones visuales

Para agregar nuevos componentes shadcn:

```
npx shadcn-ui add <componente>
```

Asegúrate de tener correctamente configurado:

```
components.json
```

---

## 📁 Estructura General

```
src/
 ├── api/
 ├── components/
 ├── context/
 ├── hooks/
 ├── pages/
 ├── router/
 ├── styles/
 └── main.tsx
```

---

## 📜 Licencia

© 2025 **Rincón Perfumes**
Todos los derechos reservados.

---

Si quieres agregar **badges**, **capturas de pantalla**, o una sección de **roadmap**, puedo generarlas también.
