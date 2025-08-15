import React from "react";
import type { Alumno } from "../types/alumno";
import { Button } from "./ui/button";

interface StudentModalProps {
  alumno: Alumno | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({
  alumno,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !alumno) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-foreground">
            Detalles del Alumno
          </h2>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">ID</label>
                <p className="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded">
                  {String(alumno.id).padStart(3, "0")}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">
                  Nombre Completo
                </label>
                <p className="text-sm text-foreground font-medium">
                  {alumno.nombreAlumno}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">
                  Fecha de Nacimiento
                </label>
                <p className="text-sm text-foreground">
                  {new Date(alumno.fechaNacimiento).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">Edad</label>
                <p className="text-sm text-foreground">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {alumno.edad} años
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">Grado</label>
                <p className="text-sm text-foreground">{alumno.grado}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">
                  Sección
                </label>
                <p className="text-sm text-foreground">
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                    {alumno.seccion}
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">
                  Grado Completo
                </label>
                <p className="text-sm text-foreground font-medium">
                  {alumno.gradoCompleto}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">
                  Nombre del Padre
                </label>
                <p className="text-sm text-foreground">{alumno.nombrePadre}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">
                  Nombre de la Madre
                </label>
                <p className="text-sm text-foreground">{alumno.nombreMadre}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-white">
                  Fecha de Ingreso
                </label>
                <p className="text-sm text-foreground">
                  {new Date(alumno.fechaIngreso).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t bg-muted/50">
          <Button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white text-black hover:bg-gray-200 h-10 px-4 py-2 cursor-pointer"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
