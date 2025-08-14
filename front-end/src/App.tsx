import { useState } from "react";
import Navbar from "./components/Navbar";
import AlumnosList from "./components/AlumnosList";
import AlumnoForm from "./components/AlumnoForm";
import "./App.css";

function App() {
  const [vistaActual, setVistaActual] = useState<"lista" | "formulario">(
    "lista"
  );
  const [shouldRefreshList, setShouldRefreshList] = useState<number>(0);

  const handleNuevoAlumno = () => {
    setVistaActual("formulario");
  };

  const handleFormSuccess = () => {
    setVistaActual("lista");
    setShouldRefreshList((prev) => prev + 1); // Trigger refresh
  };

  const handleFormCancel = () => {
    setVistaActual("lista");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        vistaActual={vistaActual}
        onCambiarVista={setVistaActual}
        onNuevoAlumno={handleNuevoAlumno}
      />

      <div className="container mx-auto p-6">
        {vistaActual === "lista" ? (
          <AlumnosList key={shouldRefreshList} />
        ) : (
          <AlumnoForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
}

export default App;
