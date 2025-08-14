// Configuración de la aplicación
export const CONFIG = {
  API_BASE_URL: "https://localhost:7027/api",
  API_KEY: "your-api-key-here", // TODO: Configurar con tu API Key real

  // Opciones de grados disponibles
  GRADOS: [
    { value: "1", label: "1er Grado" },
    { value: "2", label: "2do Grado" },
    { value: "3", label: "3er Grado" },
    { value: "4", label: "4to Grado" },
    { value: "5", label: "5to Grado" },
    { value: "6", label: "6to Grado" },
  ],

  // Opciones de secciones disponibles
  SECCIONES: [
    { value: "A", label: "Sección A" },
    { value: "B", label: "Sección B" },
    { value: "C", label: "Sección C" },
    { value: "D", label: "Sección D" },
  ],
};

// Utilidades para formateo de fechas
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};
