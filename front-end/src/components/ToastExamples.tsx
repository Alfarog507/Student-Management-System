import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const ToastExamples = () => {
  const showSuccessToast = () => {
    toast.success("¡Alumno registrado exitosamente!", {
      description: "Juan Carlos Pérez García ha sido registrado en el sistema.",
      icon: <CheckCircle className="h-4 w-4" />,
      duration: 4000,
    });
  };

  const showErrorToast = () => {
    toast.error("Error al registrar alumno", {
      description: "No se pudo conectar con el servidor. Verifica tu conexión.",
      duration: 5000,
    });
  };

  const showWarningToast = () => {
    toast.warning("Revisa los campos del formulario", {
      description: "Hay campos con errores que deben ser corregidos.",
      duration: 3000,
    });
  };

  const showInfoToast = () => {
    toast.info("Formulario listo", {
      description: "Datos del sistema cargados correctamente.",
      duration: 2000,
    });
  };

  const showLoadingToast = () => {
    const loadingToast = toast.loading("Registrando alumno...", {
      description: "Por favor espere mientras se procesa la información.",
    });

    // Simular que después de 3 segundos se resuelve
    setTimeout(() => {
      toast.dismiss(loadingToast);
      showSuccessToast();
    }, 3000);
  };

  const showCancelToast = () => {
    toast.info("Formulario cancelado", {
      description: "Los datos ingresados no fueron guardados.",
      duration: 3000,
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        Ejemplos de Notificaciones Sonner
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button
          onClick={showSuccessToast}
          className="bg-green-600 hover:bg-green-700"
        >
          Success Toast
        </Button>
        <Button onClick={showErrorToast} variant="destructive">
          Error Toast
        </Button>
        <Button
          onClick={showWarningToast}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Warning Toast
        </Button>
        <Button
          onClick={showInfoToast}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Info Toast
        </Button>
        <Button
          onClick={showLoadingToast}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Loading Toast
        </Button>
        <Button onClick={showCancelToast} variant="outline">
          Cancel Toast
        </Button>
      </div>
    </div>
  );
};

export default ToastExamples;
