import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { CreateAlumnoDto } from "../types/alumno";
import { alumnosService } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserPlus, X, Calendar, Users } from "lucide-react";

// Esquema de validación con Zod
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

interface AlumnoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type FormData = z.infer<typeof alumnoSchema>;

const AlumnoForm = ({ onSuccess, onCancel }: AlumnoFormProps) => {
  const [gradosDisponibles, setGradosDisponibles] = useState<string[]>([]);
  const [seccionesDisponibles, setSeccionesDisponibles] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(alumnoSchema),
    defaultValues: {
      nombreAlumno: "",
      fechaNacimiento: "",
      nombrePadre: "",
      nombreMadre: "",
      grado: "",
      seccion: "",
      fechaIngreso: "",
    },
  });

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

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    try {
      // Convertir fechas al formato ISO
      const dataToSend: CreateAlumnoDto = {
        ...data,
        fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
        fechaIngreso: new Date(data.fechaIngreso).toISOString(),
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus className="h-6 w-6" />
          Nuevo Alumno
        </h2>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre del Alumno */}
          <FormField
            control={form.control}
            name="nombreAlumno"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Nombre del Alumno *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el nombre completo del alumno"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha de Nacimiento */}
          <FormField
            control={form.control}
            name="fechaNacimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de Nacimiento *
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Padre y Madre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nombrePadre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Padre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre completo del padre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombreMadre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Madre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre completo de la madre"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Grado y Sección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="grado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grado *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un grado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gradosDisponibles.map((grado) => (
                        <SelectItem key={grado} value={grado}>
                          {grado}
                        </SelectItem>
                      ))}
                      <SelectItem value="1ro">1ro</SelectItem>
                      <SelectItem value="2do">2do</SelectItem>
                      <SelectItem value="3ro">3ro</SelectItem>
                      <SelectItem value="4to">4to</SelectItem>
                      <SelectItem value="5to">5to</SelectItem>
                      <SelectItem value="6to">6to</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sección *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una sección" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {seccionesDisponibles.map((seccion) => (
                        <SelectItem key={seccion} value={seccion}>
                          {seccion}
                        </SelectItem>
                      ))}
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fecha de Ingreso */}
          <FormField
            control={form.control}
            name="fechaIngreso"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de Ingreso *
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" onClick={onCancel} variant="outline">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Alumno"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AlumnoForm;
