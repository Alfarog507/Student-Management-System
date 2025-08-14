# Sistema de Gestión de Alumnos - Frontend

Sistema web desarrollado con **React + TypeScript + Vite** para la gestión de alumnos de un colegio.

## 🚀 Funcionalidades

### ✅ Implementadas

- **📋 Lista de Alumnos**: Visualización completa de todos los alumnos registrados
- **🔍 Filtros**: Filtro dinámico por grado
- **➕ Crear Alumno**: Formulario completo para registro de nuevos alumnos
- **📊 Estadísticas**: Contador de alumnos y filtros aplicados
- **🔄 Actualización en tiempo real**: Recarga automática de datos
- **📱 Responsive**: Diseño adaptable a diferentes dispositivos

### 🔧 Características Técnicas

- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Diseño moderno y responsive
- **Axios**: Cliente HTTP con interceptores para manejo de errores
- **Validación de formularios**: Validación en tiempo real
- **Manejo de estados**: Estados de carga, error y éxito
- **API REST**: Integración completa con backend .NET

### 📝 Funcionalidades Disponibles

- **Solo lectura**: Los alumnos no pueden ser editados ni eliminados
- **Creación**: Se pueden agregar nuevos alumnos
- **Visualización**: Lista completa con información detallada
- **Filtrado**: Por grado de forma dinámica

## 🛠️ Tecnologías

- **React 18** con hooks
- **TypeScript** para tipado estático
- **Vite** como bundler y servidor de desarrollo
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP

## 🔗 Endpoints de API

El frontend consume los siguientes endpoints:

```
GET    /api/Alumnos?orderBy=id          - Listar todos los alumnos
GET    /api/Alumnos/grado/{grado}       - Obtener alumnos por grado
GET    /api/Alumnos/{id}                - Obtener alumno por ID
POST   /api/Alumnos                     - Crear nuevo alumno
```

**Nota**: Las funciones de edición (PUT) y eliminación (DELETE) no están disponibles por restricciones del negocio.

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
# Configuración de la API
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TOKEN=colegio-api-key-2025
```

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📋 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── AlumnosList.tsx  # Lista principal de alumnos
│   ├── AlumnoForm.tsx   # Formulario crear alumno
│   ├── Navbar.tsx       # Barra de navegación
│   ├── Alert.tsx        # Componente de alertas
│   └── LoadingSpinner.tsx # Indicador de carga
├── services/            # Servicios de API
│   └── api.ts          # Cliente de API con Axios
├── types/              # Definiciones de TypeScript
│   └── alumno.ts       # Interfaces y tipos
├── config/             # Configuración
│   └── constants.ts    # Constantes y utilidades
└── App.tsx             # Componente principal
```

## 🎨 Diseño

- **Colores**: Paleta azul profesional con acentos verdes y púrpura
- **Iconos**: Emojis para mejor UX
- **Layout**: Diseño limpio y moderno
- **Estados**: Indicadores visuales claros para carga, error y éxito

## 🔐 Autenticación

La aplicación utiliza autenticación por API Key:

- **Header**: `X-API-Key: colegio-api-key-2025`
- **Configuración**: Via variables de entorno o valor por defecto

## 📝 Esquema de Datos

### Alumno

```typescript
interface Alumno {
  id: number;
  nombreAlumno: string;
  fechaNacimiento: string;
  nombrePadre: string;
  nombreMadre: string;
  grado: string;
  seccion: string;
  fechaIngreso: string;
  edad: number;
  gradoCompleto: string;
}
```

### CreateAlumnoDto

```typescript
interface CreateAlumnoDto {
  nombreAlumno: string; // máx 100 caracteres
  fechaNacimiento: string; // formato ISO date-time
  nombrePadre: string; // máx 100 caracteres
  nombreMadre: string; // máx 100 caracteres
  grado: string; // máx 20 caracteres
  seccion: string; // máx 10 caracteres
  fechaIngreso: string; // formato ISO date-time
}
```

## 🌐 URLs del Sistema

- **Desarrollo**: http://localhost:5173/
- **API Backend**: http://localhost:8080/api/

## 📱 Compatibilidad

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Dispositivos móviles

---

Desarrollado con ❤️ usando React + TypeScript + Vite

## Funcionalidades Implementadas

### Lista de Alumnos

- Visualización de todos los alumnos en formato de tabla
- Filtrado dinámico por grado
- Información completa de cada alumno
- Formateo de fechas en español

### Gestión de Alumnos

- Eliminación de alumnos con confirmación
- Manejo de errores y estados de carga
- Actualización automática de la lista

### Características de UX/UI

- Diseño responsive
- Indicadores de carga
- Mensajes de error claros
- Interfaz intuitiva con iconos

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Vista previa de la compilación
- `npm run lint` - Ejecuta ESLint

## Configuración de ESLint

El proyecto incluye configuración de ESLint con TypeScript:

```js
# Sistema de Gestión de Alumnos - Frontend

Sistema web desarrollado con **React + TypeScript + Vite** para la gestión de alumnos de un colegio.

## 🚀 Funcionalidades

### ✅ Implementadas
- **📋 Lista de Alumnos**: Visualización completa de todos los alumnos registrados
- **🔍 Filtros**: Filtro dinámico por grado
- **➕ Crear Alumno**: Formulario completo para registro de nuevos alumnos
- ** Estadísticas**: Contador de alumnos y filtros aplicados
- **🔄 Actualización en tiempo real**: Recarga automática de datos
- **📱 Responsive**: Diseño adaptable a diferentes dispositivos

### 🔧 Características Técnicas
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Diseño moderno y responsive
- **Axios**: Cliente HTTP con interceptores para manejo de errores
- **Validación de formularios**: Validación en tiempo real
- **Manejo de estados**: Estados de carga, error y éxito
- **API REST**: Integración completa con backend .NET

### 📝 Funcionalidades Disponibles
- **Solo lectura**: Los alumnos no pueden ser editados ni eliminados
- **Creación**: Se pueden agregar nuevos alumnos
- **Visualización**: Lista completa con información detallada
- **Filtrado**: Por grado de forma dinámica

## 🛠️ Tecnologías

- **React 18** con hooks
- **TypeScript** para tipado estático
- **Vite** como bundler y servidor de desarrollo
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP

## 🔗 Endpoints de API

El frontend consume los siguientes endpoints:

```

GET /api/Alumnos?orderBy=id - Listar todos los alumnos
GET /api/Alumnos/grado/{grado} - Obtener alumnos por grado
GET /api/Alumnos/{id} - Obtener alumno por ID
POST /api/Alumnos - Crear nuevo alumno
PUT /api/Alumnos/{id} - Actualizar alumno
DELETE /api/Alumnos/{id} - Eliminar alumno

````

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
# Configuración de la API
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TOKEN=colegio-api-key-2025
````

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📋 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── AlumnosList.tsx  # Lista principal de alumnos
│   ├── AlumnoForm.tsx   # Formulario crear/editar
│   ├── Navbar.tsx       # Barra de navegación
│   ├── Alert.tsx        # Componente de alertas
│   └── LoadingSpinner.tsx # Indicador de carga
├── services/            # Servicios de API
│   └── api.ts          # Cliente de API con Axios
├── types/              # Definiciones de TypeScript
│   └── alumno.ts       # Interfaces y tipos
├── config/             # Configuración
│   └── constants.ts    # Constantes y utilidades
└── App.tsx             # Componente principal
```

## 🎨 Diseño

- **Colores**: Paleta azul profesional con acentos verdes y rojos
- **Iconos**: Emojis para mejor UX
- **Layout**: Diseño limpio y moderno
- **Estados**: Indicadores visuales claros para carga, error y éxito

## 🔐 Autenticación

La aplicación utiliza autenticación por API Key:

- **Header**: `X-API-Key: colegio-api-key-2025`
- **Configuración**: Via variables de entorno o valor por defecto

## 📝 Esquema de Datos

### Alumno

```typescript
interface Alumno {
  id: number;
  nombreAlumno: string;
  fechaNacimiento: string;
  nombrePadre: string;
  nombreMadre: string;
  grado: string;
  seccion: string;
  fechaIngreso: string;
  edad: number;
  gradoCompleto: string;
}
```

### CreateAlumnoDto

```typescript
interface CreateAlumnoDto {
  nombreAlumno: string; // máx 100 caracteres
  fechaNacimiento: string; // formato ISO date-time
  nombrePadre: string; // máx 100 caracteres
  nombreMadre: string; // máx 100 caracteres
  grado: string; // máx 20 caracteres
  seccion: string; // máx 10 caracteres
  fechaIngreso: string; // formato ISO date-time
}
```

## 🌐 URLs del Sistema

- **Desarrollo**: http://localhost:5173/
- **API Backend**: http://localhost:8080/api/

## 📱 Compatibilidad

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Dispositivos móviles

---

Desarrollado con ❤️ usando React + TypeScript + Vite

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
````
