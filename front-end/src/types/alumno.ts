export interface Alumno {
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

export interface CreateAlumnoDto {
  nombreAlumno: string;
  fechaNacimiento: string;
  nombrePadre: string;
  nombreMadre: string;
  grado: string;
  seccion: string;
  fechaIngreso: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  count: number;
  timestamp: string;
}
