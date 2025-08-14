import { useState, useEffect } from "react";
import type { CreateAlumnoDto } from "../types/alumno";
import { alumnosService } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";

interface AlumnoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AlumnoForm = ({ onSuccess, onCancel }: AlumnoFormProps) => {
  const [formData, setFormData] = useState<CreateAlumnoDto>({
    nombreAlumno: "",
    fechaNacimiento: "",
    nombrePadre: "",
    nombreMadre: "",
    grado: "",
    seccion: "",
    fechaIngreso: "",
  });
  const [gradosDisponibles, setGradosDisponibles] = useState<string[]>([]);
  const [seccionesDisponibles, setSeccionesDisponibles] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [grados, secciones] = await Promise.all([
          alumnosService.getGrados(),
          alumnosService.getSecciones(),
        ]);
        setGradosDisponibles(grados);
        setSeccionesDisponibles(secciones);
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
      }
    };

    cargarDatosIniciales();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convertir fechas al formato ISO
      const dataToSend = {
        ...formData,
        fechaNacimiento: new Date(formData.fechaNacimiento).toISOString(),
        fechaIngreso: new Date(formData.fechaIngreso).toISOString(),
      };

      // Crear nuevo alumno
      await alumnosService.createAlumno(dataToSend);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el alumno");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Creando alumno..." />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">➕ Nuevo Alumno</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-xl"
          title="Cancelar"
        >
          ✕
        </button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre del Alumno */}
        <div>
          <label
            htmlFor="nombreAlumno"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre del Alumno *
          </label>
          <input
            type="text"
            id="nombreAlumno"
            name="nombreAlumno"
            value={formData.nombreAlumno}
            onChange={handleInputChange}
            required
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingrese el nombre completo del alumno"
          />
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label
            htmlFor="fechaNacimiento"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Nombre del Padre */}
        <div>
          <label
            htmlFor="nombrePadre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre del Padre *
          </label>
          <input
            type="text"
            id="nombrePadre"
            name="nombrePadre"
            value={formData.nombrePadre}
            onChange={handleInputChange}
            required
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingrese el nombre completo del padre"
          />
        </div>

        {/* Nombre de la Madre */}
        <div>
          <label
            htmlFor="nombreMadre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de la Madre *
          </label>
          <input
            type="text"
            id="nombreMadre"
            name="nombreMadre"
            value={formData.nombreMadre}
            onChange={handleInputChange}
            required
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingrese el nombre completo de la madre"
          />
        </div>

        {/* Grado y Sección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="grado"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Grado *
            </label>
            <select
              id="grado"
              name="grado"
              value={formData.grado}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione un grado</option>
              {gradosDisponibles.map((grado) => (
                <option key={grado} value={grado}>
                  {grado}
                </option>
              ))}
              {/* Opciones adicionales comunes */}
              <option value="1ro">1ro</option>
              <option value="2do">2do</option>
              <option value="3ro">3ro</option>
              <option value="4to">4to</option>
              <option value="5to">5to</option>
              <option value="6to">6to</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="seccion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sección *
            </label>
            <select
              id="seccion"
              name="seccion"
              value={formData.seccion}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione una sección</option>
              {seccionesDisponibles.map((seccion) => (
                <option key={seccion} value={seccion}>
                  {seccion}
                </option>
              ))}
              {/* Opciones adicionales comunes */}
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        </div>

        {/* Fecha de Ingreso */}
        <div>
          <label
            htmlFor="fechaIngreso"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fecha de Ingreso *
          </label>
          <input
            type="date"
            id="fechaIngreso"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Crear Alumno
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlumnoForm;
