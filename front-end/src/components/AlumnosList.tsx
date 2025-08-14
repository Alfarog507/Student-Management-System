import { useState, useEffect } from "react";
import type { Alumno } from "../types/alumno";
import { alumnosService } from "../services/api";
import { CONFIG, formatDate } from "../config/constants";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";

const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [filtroGrado, setFiltroGrado] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const cargarAlumnos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = filtroGrado
        ? await alumnosService.getAlumnosByGrado(filtroGrado)
        : await alumnosService.getAlumnos();
      setAlumnos(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los alumnos"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, [filtroGrado]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEliminarAlumno = async (id: number, nombre: string) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar al alumno ${nombre}?`
      )
    ) {
      try {
        await alumnosService.deleteAlumno(id);
        setAlumnos(alumnos.filter((alumno) => alumno.id !== id));
        alert("Alumno eliminado exitosamente");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al eliminar el alumno"
        );
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando lista de alumnos..." />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          📋 Lista de Alumnos
        </h2>
        <button
          onClick={cargarAlumnos}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          🔄 Actualizar
        </button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Filtro por grado */}
      <div className="mb-6">
        <label
          htmlFor="filtroGrado"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Filtrar por grado:
        </label>
        <select
          id="filtroGrado"
          value={filtroGrado}
          onChange={(e) => setFiltroGrado(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los grados</option>
          {CONFIG.GRADOS.map((grado) => (
            <option key={grado.value} value={grado.value}>
              {grado.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de alumnos */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Nombre
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Fecha Nac.
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Padre
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Madre
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Grado
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Sección
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Fecha Ingreso
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {alumnos.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                >
                  {filtroGrado
                    ? `No se encontraron alumnos en el ${
                        CONFIG.GRADOS.find((g) => g.value === filtroGrado)
                          ?.label || "grado seleccionado"
                      }`
                    : "No hay alumnos registrados"}
                </td>
              </tr>
            ) : (
              alumnos.map((alumno) => (
                <tr
                  key={alumno.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    {alumno.nombre}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {formatDate(alumno.fechaNacimiento)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {alumno.nombrePadre}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {alumno.nombreMadre}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {CONFIG.GRADOS.find((g) => g.value === alumno.grado)
                        ?.label || alumno.grado}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      Sección {alumno.seccion}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {formatDate(alumno.fechaIngreso)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <button
                      onClick={() =>
                        alumno.id &&
                        handleEliminarAlumno(alumno.id, alumno.nombre)
                      }
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                      title={`Eliminar a ${alumno.nombre}`}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Estadísticas */}
      {alumnos.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Total de alumnos mostrados:</span>{" "}
            {alumnos.length}
            {filtroGrado && (
              <span>
                {" "}
                en {CONFIG.GRADOS.find((g) => g.value === filtroGrado)?.label}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default AlumnosList;
