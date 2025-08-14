import React from "react";

interface NavbarProps {
  vistaActual: "lista" | "formulario";
  onCambiarVista: (vista: "lista" | "formulario") => void;
}

const Navbar: React.FC<NavbarProps> = ({ vistaActual, onCambiarVista }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sistema de Gestión de Alumnos</h1>
        <div className="space-x-4">
          <button
            onClick={() => onCambiarVista("lista")}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              vistaActual === "lista"
                ? "bg-blue-800 shadow-lg"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            📋 Ver Lista
          </button>
          <button
            onClick={() => onCambiarVista("formulario")}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              vistaActual === "formulario"
                ? "bg-blue-800 shadow-lg"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            ➕ Agregar Alumno
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
