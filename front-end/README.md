# Sistema de Gestión de Alumnos - Frontend

Sistema web moderno desarrollado con **React + TypeScript + Vite + shadcn/ui** para la gestión de alumnos de un colegio.

## 🚀 Funcionalidades

### ✅ Implementadas

- **📋 Lista de Alumnos**: Visualización elegante en tabla con shadcn/ui
- **🔍 Filtros Avanzados**:
  - Filtro dinámico por grado con select componente
  - Búsqueda en tiempo real por nombre, padre, madre, grado o sección
- **➕ Crear Alumno**: Formulario modal con validación robusta usando react-hook-form + zod
- **📊 Estadísticas**: Contador dinámico de alumnos y filtros aplicados
- **🔄 Actualización en tiempo real**: Recarga automática de datos
- **📱 Responsive**: Diseño completamente adaptable
- **🎨 UI Moderna**: Interfaz profesional con shadcn/ui y lucide-react icons

### 🔧 Características Técnicas Mejoradas

- **TypeScript**: Tipado estático para mayor seguridad
- **shadcn/ui**: Sistema de componentes moderno y accesible
- **Tailwind CSS**: Diseño utility-first con tema consistente
- **react-hook-form**: Manejo avanzado de formularios con validación
- **Zod**: Validación de esquemas TypeScript-first
- **lucide-react**: Iconos modernos y escalables
- **Modal Dialog**: Formulario en modal para mejor UX
- **Validación en tiempo real**: Feedback inmediato al usuario

### 🎨 Mejoras de UI/UX

- **Componentes shadcn/ui**:
  - Table, Button, Input, Select, Dialog, Card, Badge, Alert
  - Form components con validación integrada
  - Consistent design tokens
- **Iconos lucide-react**: Iconos profesionales y escalables
- **Modal para formularios**: Mejor flujo de trabajo
- **Badges**: Visualización elegante de grado, sección y edad
- **Estados de carga**: Spinners y estados disabled apropiados
- **Alertas mejoradas**: Componentes de error más elegantes

## 🛠️ Tecnologías

### Core

- **React 18** con hooks
- **TypeScript** para tipado estático
- **Vite** como bundler y servidor de desarrollo
- **Tailwind CSS** para estilos

### UI Components

- **shadcn/ui** - Sistema de componentes moderno
- **lucide-react** - Iconos escalables
- **Radix UI** - Primitivos accesibles (via shadcn/ui)

### Forms & Validation

- **react-hook-form** - Manejo de formularios
- **@hookform/resolvers** - Integración con validadores
- **zod** - Validación de esquemas

### HTTP Client

- **Axios** para peticiones HTTP

## 🔗 Endpoints de API

El frontend consume los siguientes endpoints:

```
GET    /api/Alumnos?orderBy=id          - Listar todos los alumnos
GET    /api/Alumnos/grado/{grado}       - Obtener alumnos por grado
GET    /api/Alumnos/{id}                - Obtener alumno por ID
POST   /api/Alumnos                     - Crear nuevo alumno
GET    /api/Alumnos/grados              - Obtener lista de grados
GET    /api/Alumnos/secciones           - Obtener lista de secciones
```

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
│   ├── ui/              # Componentes shadcn/ui
│   │   ├── table.tsx    # Componente tabla
│   │   ├── button.tsx   # Componente botón
│   │   ├── input.tsx    # Componente input
│   │   ├── select.tsx   # Componente select
│   │   ├── dialog.tsx   # Componente modal
│   │   ├── card.tsx     # Componente tarjeta
│   │   ├── badge.tsx    # Componente badge
│   │   ├── alert.tsx    # Componente alerta
│   │   └── form.tsx     # Componentes de formulario
│   ├── AlumnosList.tsx  # Lista principal con filtros
│   ├── AlumnoForm.tsx   # Formulario con validación
│   ├── Navbar.tsx       # Barra de navegación moderna
│   ├── Alert.tsx        # Componente de alertas (legacy)
│   └── LoadingSpinner.tsx # Indicador de carga
├── lib/                 # Utilidades
│   └── utils.ts         # Funciones utilitarias shadcn/ui
├── services/            # Servicios de API
│   └── api.ts          # Cliente de API con Axios
├── types/              # Definiciones de TypeScript
│   └── alumno.ts       # Interfaces y tipos
├── config/             # Configuración
│   └── constants.ts    # Constantes y utilidades
├── components.json     # Configuración shadcn/ui
└── App.tsx             # Componente principal
```

## 🎨 Diseño

### Sistema de Colores (shadcn/ui)

- **Primary**: Azul profesional para elementos principales
- **Secondary**: Gris neutro para elementos secundarios
- **Destructive**: Rojo para alertas y errores
- **Muted**: Gris suave para texto secundario
- **Border**: Bordes sutiles y consistentes

### Componentes UI

- **Table**: Tabla elegante con hover states
- **Badges**: Para grado, sección y edad con colores distintivos
- **Modal Dialog**: Formulario en modal con backdrop
- **Buttons**: Variantes primary, secondary, outline, ghost
- **Form Fields**: Con validación visual integrada

### Iconos

- **lucide-react**: Librería moderna de iconos SVG
- **Consistencia**: Iconos coherentes en toda la aplicación
- **Accesibilidad**: Iconos con labels apropiados

## 🔐 Autenticación

La aplicación utiliza autenticación por API Key:

- **Header**: `X-API-Key: colegio-api-key-2025`
- **Configuración**: Via variables de entorno o valor por defecto

## 📝 Esquema de Validación

### Validación con Zod

```typescript
const alumnoSchema = z.object({
  nombreAlumno: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine((date) => {
      const fechaNac = new Date(date);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      return edad >= 3 && edad <= 18;
    }, "La edad debe estar entre 3 y 18 años"),
  nombrePadre: z
    .string()
    .min(2, "El nombre del padre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  nombreMadre: z
    .string()
    .min(2, "El nombre de la madre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  grado: z.string().min(1, "Debe seleccionar un grado"),
  seccion: z.string().min(1, "Debe seleccionar una sección"),
  fechaIngreso: z
    .string()
    .min(1, "La fecha de ingreso es requerida")
    .refine((date) => {
      const fechaIngreso = new Date(date);
      const hoy = new Date();
      return fechaIngreso <= hoy;
    }, "La fecha de ingreso no puede ser futura"),
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

type FormData = z.infer<typeof alumnoSchema>;
```

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
