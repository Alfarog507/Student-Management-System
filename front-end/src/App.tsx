import { useState } from "react";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import AlumnosList from "./components/AlumnosList";
import "./App.css";

function App() {
  const [vistaActual, setVistaActual] = useState<"lista" | "formulario">(
    "lista"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar vistaActual={vistaActual} onCambiarVista={setVistaActual} />

      <div className="container mx-auto p-6">
        {vistaActual === "lista" ? (
          <AlumnosList />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              ➕ Agregar Nuevo Alumno
            </h2>
            <div className="text-center py-8">
              <LoadingSpinner message="Próximamente: Formulario de alumnos" />
              <p className="text-gray-600 mt-4">
                El formulario se implementará en el siguiente commit
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
