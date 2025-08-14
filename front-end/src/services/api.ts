import axios from "axios";
import type { Alumno, CreateAlumnoDto } from "../types/alumno";
import { CONFIG } from "../config/constants";

const API_BASE_URL = CONFIG.API_BASE_URL;
const API_TOKEN = CONFIG.API_TOKEN;

// Configuración de axios con interceptores para manejo de errores
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_TOKEN}`, // Autenticación con Bearer token
  },
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response) {
      // El servidor respondió con un código de error
      throw new Error(
        `Error ${error.response.status}: ${
          error.response.data?.message || "Error del servidor"
        }`
      );
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      throw new Error(
        "No se pudo conectar con el servidor. Verifica que la API esté corriendo."
      );
    } else {
      // Error en la configuración de la petición
      throw new Error("Error en la configuración de la petición");
    }
  }
);

export const alumnosService = {
  // Obtener todos los alumnos
  getAlumnos: async (): Promise<Alumno[]> => {
    try {
      const response = await apiClient.get("/alumnos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
      throw error;
    }
  },

  // Obtener alumnos por grado
  getAlumnosByGrado: async (grado: string): Promise<Alumno[]> => {
    try {
      const response = await apiClient.get(`/alumnos/grado/${grado}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener alumnos por grado:", error);
      throw error;
    }
  },

  // Crear nuevo alumno
  createAlumno: async (alumno: CreateAlumnoDto): Promise<Alumno> => {
    try {
      const response = await apiClient.post("/alumnos", alumno);
      return response.data;
    } catch (error) {
      console.error("Error al crear alumno:", error);
      throw error;
    }
  },

  // Actualizar alumno
  updateAlumno: async (
    id: number,
    alumno: CreateAlumnoDto
  ): Promise<Alumno> => {
    try {
      const response = await apiClient.put(`/alumnos/${id}`, alumno);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar alumno:", error);
      throw error;
    }
  },

  // Eliminar alumno
  deleteAlumno: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/alumnos/${id}`);
    } catch (error) {
      console.error("Error al eliminar alumno:", error);
      throw error;
    }
  },
};

export default alumnosService;
