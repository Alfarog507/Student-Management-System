export interface Alumno {
  id?: number;
  nombre: string;
  fechaNacimiento: string;
  nombrePadre: string;
  nombreMadre: string;
  grado: string;
  seccion: string;
  fechaIngreso: string;
}

export interface CreateAlumnoDto {
  nombre: string;
  fechaNacimiento: string;
  nombrePadre: string;
  nombreMadre: string;
  grado: string;
  seccion: string;
  fechaIngreso: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
