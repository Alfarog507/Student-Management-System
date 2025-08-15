import { useState } from "react";
import Navbar from "./components/Navbar";
import AlumnosList from "./components/AlumnosList";
import AlumnoForm from "./components/AlumnoForm";
import { Dialog, DialogContent } from "./components/ui/dialog";
import { Toaster } from "sonner";

function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [shouldRefreshList, setShouldRefreshList] = useState(0);

  const handleNuevoAlumno = () => {
    setMostrarFormulario(true);
  };

  const handleFormSuccess = () => {
    setMostrarFormulario(false);
    setShouldRefreshList((prev) => prev + 1);
  };

  const handleFormCancel = () => {
    setMostrarFormulario(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNuevoAlumno={handleNuevoAlumno} />
      <AlumnosList key={shouldRefreshList} />

      <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
        <DialogContent className="">
          <AlumnoForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" expand={true} richColors closeButton />
    </div>
  );
}

export default App;
