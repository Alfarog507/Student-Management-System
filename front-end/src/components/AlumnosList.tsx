import React, { useState, useEffect } from "react";
import { alumnosService } from "../services/api";
import type { Alumno } from "../types/alumno";
import LoadingSpinner from "./LoadingSpinner";
import StudentModal from "./AlumnoModal";
import { EyeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const AlumnosList: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [grados, setGrados] = useState<string[]>([]);
  const [secciones, setSecciones] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroId, setFiltroId] = useState("");
  const [filtroGrado, setFiltroGrado] = useState<string | null>(null);
  const [filtroSeccion, setFiltroSeccion] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const alumnosData = await alumnosService.getAlumnos();
        setAlumnos(alumnosData);
        setTotalItems(alumnosData.length);

        const gradosData = await alumnosService.getGrados();
        setGrados(gradosData);

        const seccionesData = await alumnosService.getSecciones();
        setSecciones(seccionesData);
      } catch (error) {
        console.error("Error al cargar datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let filteredAlumnos;

      if (filtroGrado !== null) {
        filteredAlumnos = await alumnosService.getAlumnosByGrado(filtroGrado);
      } else {
        filteredAlumnos = await alumnosService.getAlumnos();
      }

      // Filtro adicional por ID y sección si es necesario
      if (filtroId) {
        filteredAlumnos = filteredAlumnos.filter((a: Alumno) =>
          a.id.toString().includes(filtroId)
        );
      }

      if (filtroSeccion !== null) {
        filteredAlumnos = filteredAlumnos.filter(
          (a: Alumno) => a.seccion === filtroSeccion
        );
      }

      setAlumnos(filteredAlumnos);
      setTotalItems(filteredAlumnos.length);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al filtrar", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerTodos = async () => {
    setFiltroId("");
    setFiltroGrado(null);
    setFiltroSeccion(null);
    setLoading(true);
    try {
      const alumnosData = await alumnosService.getAlumnos();
      setAlumnos(alumnosData);
      setTotalItems(alumnosData.length);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al cargar todos los alumnos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalles = (alumno: Alumno) => {
    setSelectedAlumno(alumno);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlumno(null);
  };

  // Cálculos para paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlumnos = alumnos.slice(startIndex, startIndex + itemsPerPage);

  // Función para obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="flex-1 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección de filtros */}
        <div className="bg-white rounded-xl mb-8 shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Filtros de Búsqueda</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="filtroId"
                className="block text-sm font-medium text-gray-700"
              >
                ID Alumno
              </Label>
              <Input
                id="filtroId"
                type="text"
                placeholder="Buscar por ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filtroId}
                onChange={(e) => setFiltroId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="filtroGrado"
                className="block text-sm font-medium text-gray-700"
              >
                Grado
              </Label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                value={filtroGrado || ""}
                onChange={(e) =>
                  setFiltroGrado(e.target.value ? e.target.value : null)
                }
              >
                <option value="">Todos los grados</option>
                {grados.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="filtroSeccion"
                className="block text-sm font-medium text-gray-700"
              >
                Sección
              </Label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                value={filtroSeccion || ""}
                onChange={(e) =>
                  setFiltroSeccion(e.target.value ? e.target.value : null)
                }
              >
                <option value="">Todas las secciones</option>
                {secciones.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3">
              <Button
                onClick={handleSearch}
                className="flex-1 bg-gray-900 text-white hover:bg-gray-800 transition-colors px-4 py-5 rounded-md font-medium cursor-pointer"
              >
                Buscar
              </Button>
              <Button
                type="button"
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors px-4 py-5 rounded-md font-medium cursor-pointer"
                onClick={handleVerTodos}
              >
                Ver Todos
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de alumnos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Alumnos
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona la información de los estudiantes
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alumno
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grado Completo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Ingreso
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAlumnos.map((alumno) => {
                  const initials = getInitials(alumno.nombreAlumno);
                  const gradoCompleto = `${alumno.grado} ${alumno.seccion}`;

                  return (
                    <tr
                      key={alumno.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {String(alumno.id).padStart(3, "0")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                            <span className="text-xs font-medium text-gray-700">
                              {initials}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {alumno.nombreAlumno}
                            </div>
                            <div className="text-sm text-gray-500">
                              {`${alumno.nombreAlumno
                                .toLowerCase()
                                .replace(/\s+/g, ".")}@email.com`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {alumno.edad} años
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {gradoCompleto}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {new Date(alumno.fechaIngreso).toLocaleDateString(
                          "es-ES"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleVerDetalles(alumno)}
                        >
                          <EyeIcon size={16} className="mr-2" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">{totalItems}</span> resultados
              </p>
            </div>
            <div>
              <nav className="inline-flex -space-x-px rounded-md shadow-sm">
                <Button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                </Button>
                <Button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-900 text-sm font-medium text-white">
                  {currentPage}
                </Button>
                <Button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(totalItems / itemsPerPage), p + 1)
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(totalItems / itemsPerPage)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles del alumno */}
      <StudentModal
        alumno={selectedAlumno}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
};

export default AlumnosList;
