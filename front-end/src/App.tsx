import { useState } from "react";
import Navbar from "./components/Navbar";
import AlumnosList from "./components/AlumnosList";
import AlumnoForm from "./components/AlumnoForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import "./App.css";

function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [shouldRefreshList, setShouldRefreshList] = useState<number>(0);

  const handleNuevoAlumno = () => {
    setMostrarFormulario(true);
  };

  const handleFormSuccess = () => {
    setMostrarFormulario(false);
    setShouldRefreshList((prev) => prev + 1); // Trigger refresh
  };

  const handleFormCancel = () => {
    setMostrarFormulario(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNuevoAlumno={handleNuevoAlumno} />

      <div className="container mx-auto p-6">
        <AlumnosList key={shouldRefreshList} />
      </div>

      <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlumnoForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
