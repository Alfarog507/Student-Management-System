import axios from "axios";
import type { Alumno, CreateAlumnoDto, ApiResponse } from "../types/alumno";
import { CONFIG } from "../config/constants";

const API_BASE_URL = CONFIG.API_BASE_URL;
const API_TOKEN = CONFIG.API_TOKEN;

// Configuración de axios con interceptores para manejo de errores
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_TOKEN, // Autenticación con X-API-Key token
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
      const response = await apiClient.get<ApiResponse<Alumno[]>>(
        "/Alumnos?orderBy=id"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
      throw error;
    }
  },

  // Obtener alumnos por grado
  getAlumnosByGrado: async (grado: string): Promise<Alumno[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Alumno[]>>(
        `/Alumnos/grado/${grado}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener alumnos por grado:", error);
      throw error;
    }
  },

  // Obtener alumno por ID
  getAlumnoById: async (id: number): Promise<Alumno> => {
    try {
      const response = await apiClient.get<ApiResponse<Alumno>>(
        `/Alumnos/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener alumno por ID:", error);
      throw error;
    }
  },

  // Crear nuevo alumno
  createAlumno: async (alumno: CreateAlumnoDto): Promise<Alumno> => {
    try {
      const response = await apiClient.post<ApiResponse<Alumno>>(
        "/Alumnos",
        alumno
      );
      return response.data.data;
    } catch (error) {
      console.error("Error al crear alumno:", error);
      throw error;
    }
  },

  // Obtener grados únicos
  getGrados: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Alumno[]>>(
        "/Alumnos?orderBy=id"
      );
      const alumnos = response.data.data;
      const gradosUnicos = [...new Set(alumnos.map((alumno) => alumno.grado))];
      return gradosUnicos.sort();
    } catch (error) {
      console.error("Error al obtener grados:", error);
      throw error;
    }
  },

  // Obtener secciones únicas
  getSecciones: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Alumno[]>>(
        "/Alumnos?orderBy=id"
      );
      const alumnos = response.data.data;
      const seccionesUnicas = [
        ...new Set(alumnos.map((alumno) => alumno.seccion)),
      ];
      return seccionesUnicas.sort();
    } catch (error) {
      console.error("Error al obtener secciones:", error);
      throw error;
    }
  },
};

export default alumnosService;
