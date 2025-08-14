import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { List, UserPlus, GraduationCap } from "lucide-react";

interface NavbarProps {
  onNuevoAlumno?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNuevoAlumno }) => {
  return (
    <Card className="rounded-none border-x-0 border-t-0 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <GraduationCap className="h-8 w-8" />
            Sistema de Gestión de Alumnos
          </h1>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <List className="h-4 w-4 mr-2" />
              Lista de Alumnos
            </Button>

            <Button
              onClick={onNuevoAlumno}
              variant="secondary"
              size="sm"
              className="shadow-lg"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Alumno
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;
