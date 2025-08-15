import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import {
  UserPlus,
  X,
  Calendar,
  Users,
  User,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

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

  // Referencia para evitar cargar datos múltiples veces
  const hasLoadedData = useRef<boolean>(false);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      // Evitar cargar datos múltiples veces
      if (hasLoadedData.current) return;
      hasLoadedData.current = true;

      try {
        const [grados, secciones] = await Promise.all([
          alumnosService.getGrados(),
          alumnosService.getSecciones(),
        ]);

        // Solo mostrar toast si realmente se obtuvieron datos del servidor
        if (grados.length > 0 || secciones.length > 0) {
          setGradosDisponibles(grados);
          setSeccionesDisponibles(secciones);

          toast.success("Formulario listo", {
            description: `Cargados ${grados.length} grados y ${secciones.length} secciones.`,
            duration: 2000,
          });
        } else {
          // Si no hay datos del servidor, usar valores por defecto sin toast de éxito
          setGradosDisponibles([]);
          setSeccionesDisponibles([]);
        }
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
        toast.error("Error al cargar datos", {
          description:
            "No se pudieron cargar los grados y secciones disponibles. Usando valores por defecto.",
          duration: 4000,
        });

        // Establecer valores por defecto en caso de error
        setGradosDisponibles([]);
        setSeccionesDisponibles([]);
      }
    };

    cargarDatosIniciales();
  }, []);

  const handleCancel = () => {
    // Verificar si el formulario tiene datos
    const formValues = form.getValues();
    const hasData = Object.values(formValues).some((value) => value !== "");

    if (hasData) {
      toast.info("Formulario cancelado", {
        description: "Los datos ingresados no fueron guardados.",
        duration: 3000,
      });
    }

    onCancel();
  };

  const onSubmit = async (data: FormData) => {
    // Verificar si hay errores de validación
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      // Mostrar error específico según el campo
      const firstError = Object.keys(errors)[0];
      let errorMsg = "Hay campos con errores que deben ser corregidos.";

      switch (firstError) {
        case "nombreAlumno":
          errorMsg =
            "El nombre del alumno es requerido y debe tener al menos 2 caracteres.";
          break;
        case "fechaNacimiento":
          errorMsg =
            "La fecha de nacimiento es requerida y el alumno debe tener entre 3 y 18 años.";
          break;
        case "nombrePadre":
          errorMsg = "El nombre del padre es requerido.";
          break;
        case "nombreMadre":
          errorMsg = "El nombre de la madre es requerido.";
          break;
        case "grado":
          errorMsg = "Debe seleccionar un grado.";
          break;
        case "seccion":
          errorMsg = "Debe seleccionar una sección.";
          break;
        case "fechaIngreso":
          errorMsg = "La fecha de ingreso es requerida y no puede ser futura.";
          break;
      }

      toast.warning("Revisa los campos del formulario", {
        description: errorMsg,
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    setError("");

    // Toast de loading
    const loadingToast = toast.loading("Registrando alumno...", {
      description: "Por favor espere mientras se procesa la información.",
    });

    try {
      // Convertir fechas al formato ISO
      const dataToSend: CreateAlumnoDto = {
        ...data,
        fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
        fechaIngreso: new Date(data.fechaIngreso).toISOString(),
      };

      // Crear nuevo alumno
      await alumnosService.createAlumno(dataToSend);

      // Cerrar toast de loading
      toast.dismiss(loadingToast);

      // Toast de éxito
      toast.success("¡Alumno registrado exitosamente!", {
        description: `${data.nombreAlumno} ha sido registrado en el sistema.`,
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 4000,
      });

      form.reset();
      onSuccess();
    } catch (err) {
      // Cerrar toast de loading
      toast.dismiss(loadingToast);

      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el alumno";
      setError(errorMessage);

      // Toast de error
      toast.error("Error al registrar alumno", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <LoadingSpinner message="Creando alumno..." />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              <UserPlus className="h-6 w-6 text-blue-600" />
              Registrar Nuevo Alumno
            </h2>
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 bg-red-50 border-red-200"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800 font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Información del Estudiante */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Información del Estudiante
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="nombreAlumno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Nombre Completo del Alumno *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Juan Carlos Pérez García"
                            className={`h-11 ${
                              form.formState.errors.nombreAlumno
                                ? "border-red-500 focus:border-red-500 bg-red-50"
                                : ""
                            }`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 font-medium text-sm flex items-center gap-1">
                          {form.formState.errors.nombreAlumno && (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Fecha de Nacimiento *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className={`h-11 ${
                              form.formState.errors.fechaNacimiento
                                ? "border-red-500 focus:border-red-500 bg-red-50"
                                : ""
                            }`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 font-medium text-sm flex items-center gap-1">
                          {form.formState.errors.fechaNacimiento && (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Información de los Padres */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-green-100">
                    <User className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Información de los Padres
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nombrePadre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Nombre del Padre *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre completo del padre"
                              className={`h-11 ${
                                form.formState.errors.nombrePadre
                                  ? "border-red-500 focus:border-red-500 bg-red-50"
                                  : ""
                              }`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 font-medium text-sm flex items-center gap-1">
                            {form.formState.errors.nombrePadre && (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nombreMadre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Nombre de la Madre *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre completo de la madre"
                              className={`h-11 ${
                                form.formState.errors.nombreMadre
                                  ? "border-red-500 focus:border-red-500 bg-red-50"
                                  : ""
                              }`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 font-medium text-sm flex items-center gap-1">
                            {form.formState.errors.nombreMadre && (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Información Académica */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Información Académica
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="grado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Grado *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={`h-11 bg-white border-2 rounded-lg shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 ${
                                  form.formState.errors.grado
                                    ? "border-red-500 focus:border-red-500 bg-red-50 focus:ring-red-200"
                                    : "border-gray-200"
                                }`}
                              >
                                <SelectValue
                                  placeholder="🎓 Seleccione un grado"
                                  className="text-gray-700 font-medium"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {gradosDisponibles.length > 0 ? (
                                gradosDisponibles.map((grado) => (
                                  <SelectItem
                                    key={grado}
                                    value={grado}
                                    className="hover:bg-purple-50 focus:bg-purple-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-purple-600" />
                                      {grado}
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem
                                    value="1ro"
                                    className="hover:bg-purple-50 focus:bg-purple-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-purple-600" />
                                      1er Grado
                                    </div>
                                  </SelectItem>
                                  <SelectItem
                                    value="2do"
                                    className="hover:bg-purple-50 focus:bg-purple-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-purple-600" />
                                      2do Grado
                                    </div>
                                  </SelectItem>
                                  <SelectItem
                                    value="3ro"
                                    className="hover:bg-purple-50 focus:bg-purple-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-purple-600" />
                                      3er Grado
                                    </div>
                                  </SelectItem>
                                  <SelectItem
                                    value="4to"
                                    className="hover:bg-purple-50 focus:bg-purple-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-purple-600" />
                                      4to Grado
                                    </div>
                                  </SelectItem>
                                  <SelectItem
                                    value="5to"
                                    className="hover:bg-purple-50 focus:bg-purple-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-purple-600" />
                                      5to Grado
                                    </div>
                                  </SelectItem>
                                  <SelectItem
                                    value="6to"
                                    className="hover:bg-purple-50 focus:bg-purple-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-purple-600" />
                                      6to Grado
                                    </div>
                                  </SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-600 font-medium text-sm flex items-center gap-1">
                            {form.formState.errors.grado && (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Sección *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={`h-11 bg-white border-2 rounded-lg shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                                  form.formState.errors.seccion
                                    ? "border-red-500 focus:border-red-500 bg-red-50 focus:ring-red-200"
                                    : "border-gray-200"
                                }`}
                              >
                                <SelectValue
                                  placeholder="📚 Seleccione una sección"
                                  className="text-gray-700 font-medium"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {seccionesDisponibles.length > 0 ? (
                                seccionesDisponibles.map((seccion) => (
                                  <SelectItem
                                    key={seccion}
                                    value={seccion}
                                    className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {seccion}
                                      </div>
                                      Sección {seccion}
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem
                                    value="A"
                                    className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        A
                                      </div>
                                      Sección A
                                    </div>
                                  </SelectItem>
                                  <SelectItem
                                    value="B"
                                    className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        B
                                      </div>
                                      Sección B
                                    </div>
                                  </SelectItem>
                                  <SelectItem
                                    value="C"
                                    className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        C
                                      </div>
                                      Sección C
                                    </div>
                                  </SelectItem>
                                  <SelectItem
                                    value="D"
                                    className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer py-3 px-4 text-gray-700 font-medium transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        D
                                      </div>
                                      Sección D
                                    </div>
                                  </SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-600 font-medium text-sm flex items-center gap-1">
                            {form.formState.errors.seccion && (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fechaIngreso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Fecha de Ingreso *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className={`h-11 max-w-xs ${
                                form.formState.errors.fechaIngreso
                                  ? "border-red-500 focus:border-red-500 bg-red-50"
                                  : ""
                              }`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 font-medium text-sm flex items-center gap-1">
                            {form.formState.errors.fechaIngreso && (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-8 border-t bg-gray-50 mt-6">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="h-11 px-8 border-gray-300 text-white hover:bg-gray-50 hover:text-black hover:border-gray-400 transition-all duration-200 font-medium cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
              className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium 
              cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creando..." : "Registrar Alumno"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumnoForm;
