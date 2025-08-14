import { useState, useEffect } from "react";
import type { Alumno } from "../types/alumno";
import { alumnosService } from "../services/api";
import { formatDate } from "../config/constants";
import LoadingSpinner from "./LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Users, Search, Filter } from "lucide-react";

const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [gradosDisponibles, setGradosDisponibles] = useState<string[]>([]);
  const [filtroGrado, setFiltroGrado] = useState<string | undefined>(undefined);
  const [busqueda, setBusqueda] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const cargarGrados = async () => {
    try {
      const grados = await alumnosService.getGrados();
      setGradosDisponibles(grados);
    } catch (err) {
      console.error("Error al cargar grados:", err);
    }
  };

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
    cargarGrados();
  }, []);

  useEffect(() => {
    cargarAlumnos();
  }, [filtroGrado]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtrar alumnos por búsqueda
  const alumnosFiltrados = alumnos.filter(
    (alumno) =>
      alumno.nombreAlumno.toLowerCase().includes(busqueda.toLowerCase()) ||
      alumno.nombrePadre.toLowerCase().includes(busqueda.toLowerCase()) ||
      alumno.nombreMadre.toLowerCase().includes(busqueda.toLowerCase()) ||
      alumno.grado.toLowerCase().includes(busqueda.toLowerCase()) ||
      alumno.seccion.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Cargando lista de alumnos..." />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6" />
            Lista de Alumnos
          </CardTitle>
          <Button onClick={cargarAlumnos} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label
              htmlFor="busqueda"
              className="text-sm font-medium mb-2 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Buscar alumno
            </Label>
            <Input
              id="busqueda"
              placeholder="Buscar por nombre, padre, madre, grado o sección..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="sm:w-48">
            <Label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrar por grado
            </Label>
            <Select
              value={filtroGrado || "all"}
              onValueChange={(value) =>
                setFiltroGrado(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los grados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los grados</SelectItem>
                {gradosDisponibles.map((grado) => (
                  <SelectItem key={grado} value={grado}>
                    {grado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha Nac.</TableHead>
                <TableHead>Padre</TableHead>
                <TableHead>Madre</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead>Edad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumnosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {busqueda
                      ? `No se encontraron alumnos que coincidan con "${busqueda}"`
                      : filtroGrado
                      ? `No se encontraron alumnos en el grado ${filtroGrado}`
                      : "No hay alumnos registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                alumnosFiltrados.map((alumno) => (
                  <TableRow key={alumno.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {alumno.nombreAlumno}
                    </TableCell>
                    <TableCell>{formatDate(alumno.fechaNacimiento)}</TableCell>
                    <TableCell>{alumno.nombrePadre}</TableCell>
                    <TableCell>{alumno.nombreMadre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{alumno.grado}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Sección {alumno.seccion}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(alumno.fechaIngreso)}</TableCell>
                    <TableCell>
                      <Badge variant="default">{alumno.edad} años</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Estadísticas */}
        {alumnosFiltrados.length > 0 && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Total de alumnos mostrados:</span>{" "}
              {alumnosFiltrados.length}
              {busqueda && <span> (filtrados por "{busqueda}")</span>}
              {filtroGrado && <span> en grado {filtroGrado}</span>}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlumnosList;
