# 🎯 Frontend - Sistema de Gestión de Alumnos

Frontend moderno desarrollado con **React + TypeScript + Vite + Shadcn/ui** para el sistema de gestión de alumnos del colegio.

## 🚀 Funcionalidades Implementadas

### ✅ Gestión Completa de Alumnos

- **📋 Lista de Alumnos**: Visualización elegante en tabla responsiva
- **🔍 Filtros Avanzados**: Búsqueda en tiempo real y filtro por grado
- **➕ Crear Alumno**: Formulario modal con validación robusta
- **✏️ Editar Alumno**: Formulario de edición con datos precargados
- **�️ Eliminar Alumno**: Confirmación antes de eliminar
- **� Estadísticas**: Contador dinámico de alumnos
- **🎨 Notificaciones**: Sistema de toast con Sonner

### 🔧 Características Técnicas

- **TypeScript**: Tipado estático para mayor seguridad
- **Shadcn/ui**: Sistema de componentes moderno y accesible
- **Tailwind CSS**: Diseño utility-first responsivo
- **React Hook Form + Zod**: Validación de formularios avanzada
- **Sonner**: Sistema de notificaciones toast
- **Lucide React**: Iconografía moderna y escalable

## 🛠️ Stack Tecnológico

### Core Framework

- **React 19** - Biblioteca de UI moderna
- **TypeScript** - Tipado estático y desarrollo seguro
- **Vite** - Build tool rápido y servidor de desarrollo
- **Tailwind CSS** - Framework CSS utility-first

### UI & Components

- **Shadcn/ui** - Sistema de componentes moderno
- **Radix UI** - Primitivos accesibles
- **Lucide React** - Iconos SVG escalables
- **Sonner** - Sistema de notificaciones toast

### Formularios & Validación

- **React Hook Form** - Manejo performante de formularios
- **Zod** - Validación de esquemas TypeScript-first
- **@hookform/resolvers** - Integración con validadores

### HTTP & Estado

- **Axios** - Cliente HTTP con interceptores

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Backend API ejecutándose en puerto 8080

### Variables de Entorno

Crear archivo `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TOKEN=colegio-api-key-2025
```

### Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🐳 Docker

### Construir imagen

```bash
docker build -t frontend-alumnos .
```

### Ejecutar contenedor

```bash
docker run -p 3000:80 frontend-alumnos
```

## � Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes Shadcn/ui
│   │   ├── button.tsx   # Botones reutilizables
│   │   ├── input.tsx    # Campos de entrada
│   │   ├── dialog.tsx   # Modales y diálogos
│   │   ├── table.tsx    # Tablas responsivas
│   │   └── ...          # Otros componentes base
│   ├── AlumnoForm.tsx   # Formulario de alumnos
│   ├── AlumnosList.tsx  # Lista y tabla de alumnos
│   ├── AlumnoModal.tsx  # Modal para CRUD
│   ├── Navbar.tsx       # Barra de navegación
│   └── ToastExamples.tsx # Ejemplos de notificaciones
├── services/            # Servicios de API
│   └── api.ts          # Cliente HTTP con Axios
├── types/              # Definiciones TypeScript
│   └── alumno.ts       # Interfaces del dominio
├── lib/                # Utilidades
│   └── utils.ts        # Helpers y funciones utilitarias
├── config/             # Configuraciones
│   └── constants.ts    # Constantes globales
└── assets/             # Recursos estáticos
```

## 🔗 API Endpoints

```bash
GET    /api/Alumnos              # Listar todos los alumnos
GET    /api/Alumnos/{id}         # Obtener alumno por ID
POST   /api/Alumnos              # Crear nuevo alumno
PUT    /api/Alumnos/{id}         # Actualizar alumno
DELETE /api/Alumnos/{id}         # Eliminar alumno
GET    /api/Alumnos/grado/{grado} # Filtrar por grado
```

## 🎨 Componentes Principales

### AlumnoForm

Formulario con validación completa usando React Hook Form + Zod

- Validación en tiempo real
- Manejo de errores elegante
- Campos obligatorios marcados

### AlumnosList

Tabla responsiva con funcionalidades avanzadas

- Filtros por grado y búsqueda
- Acciones CRUD integradas
- Estados de carga y error

### AlumnoModal

Modal reutilizable para operaciones CRUD

- Apertura/cierre fluido
- Formulario integrado
- Confirmaciones de eliminación

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl configurados
- **Componentes Flexibles**: Adaptación automática
- **Touch Friendly**: Botones y elementos táctiles

## 📝 Esquema de Validación

## 📝 Esquemas de Validación

### Validación con Zod

```typescript
const alumnoSchema = z.object({
  nombreAlumno: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  fechaNacimiento: z
    .string()
    .min(1, "Campo requerido")
    .refine((date) => {
      const edad = calcularEdad(new Date(date));
      return edad >= 3 && edad <= 18;
    }, "Edad debe estar entre 3 y 18 años"),
  nombrePadre: z.string().min(2).max(100),
  nombreMadre: z.string().min(2).max(100),
  grado: z.string().min(1, "Seleccione un grado"),
  seccion: z.string().min(1, "Seleccione una sección"),
  fechaIngreso: z
    .string()
    .refine(
      (date) => new Date(date) <= new Date(),
      "No puede ser fecha futura"
    ),
});
```

### Tipos TypeScript

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

## 🌐 URLs del Sistema

- **Desarrollo**: http://localhost:5173
- **Producción (Docker)**: http://localhost:3000
- **API Backend**: http://localhost:8080

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (Vite)
npm run build    # Build optimizado para producción
npm run preview  # Preview del build de producción
npm run lint     # Análisis de código con ESLint
```

## 🚀 Características Destacadas

- ✅ **UI Moderna**: Componentes Shadcn/ui profesionales
- ✅ **Validación Robusta**: React Hook Form + Zod
- ✅ **Notificaciones**: Sistema toast con Sonner
- ✅ **Responsive**: Adaptable a todos los dispositivos
- ✅ **TypeScript**: Tipado completo y seguro
- ✅ **Performance**: Build optimizado con Vite
- ✅ **Accesibilidad**: Componentes accesibles con Radix UI
- ✅ **Dockerizado**: Contenedor listo para producción

---

**Desarrollado con ❤️ por Gabriel Alfaro**  
_Stack: React 19 + TypeScript + Vite + Shadcn/ui + Tailwind CSS_

## 🌐 URLs del Sistema

- **Desarrollo**: http://localhost:5173/
- **API Backend**: http://localhost:8080/api/

## 📱 Compatibilidad

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Dispositivos móviles y tablets

## 🚀 Nuevas Funcionalidades Implementadas

### 1. Sistema de Componentes Moderno

- Migración completa a **shadcn/ui**
- Componentes reutilizables y accesibles
- Tema consistente con design tokens

### 2. Filtros Avanzados

- **Búsqueda en tiempo real** por múltiples campos
- **Filtro por grado** con select elegante
- **Resultados dinámicos** con contador actualizado

### 3. Formulario Modal Mejorado

- **Modal Dialog** en lugar de página separada
- **Validación robusta** con react-hook-form + zod
- **Feedback visual** inmediato en campos
- **Validación de edad** y fechas inteligente

### 4. UI/UX Profesional

- **Tabla moderna** con estados hover
- **Badges coloreados** para mejor visualización
- **Iconos lucide-react** para mejor comunicación visual
- **Estados de carga** más elegantes

### 5. Experiencia de Usuario Mejorada

- **Navegación simplificada** con modal
- **Respuesta visual inmediata** en todas las acciones
- **Mensajes de error** más claros y útiles
- **Design responsive** optimizado

---

Desarrollado con ❤️ usando **React + TypeScript + Vite + shadcn/ui**

## 🛠️ Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Vista previa de la compilación
- `npm run lint` - Ejecuta ESLint

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.x.x",
    "@hookform/resolvers": "^3.x.x",
    "zod": "^3.x.x",
    "lucide-react": "^0.x.x",
    "axios": "^1.x.x"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^20.x.x",
    "typescript": "^5.5.3",
    "vite": "^7.1.2",
    "tailwindcss": "^4.x.x"
  }
}
```

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
