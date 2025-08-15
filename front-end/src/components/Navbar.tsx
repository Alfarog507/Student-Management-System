import React from "react";

interface NavbarProps {
  onNuevoAlumno: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNuevoAlumno }) => {
  return (
    <header className="bg-white dark:bg-gray-300 border-b border-neutral-200 dark:border-neutral-200">
      <div className="mx-auto px-4 lg:px-6 container">
        <div className="items-center justify-between h-14 flex">
          <div className="items-center flex gap-6">
            <div className="items-center flex gap-2">
              <div className="w-8 h-8 bg-neutral-900 dark:bg-neutral-100 rounded-md items-center justify-center flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white dark:text-neutral-900"
                  id="Windframe_Hhf3TZPmw"
                >
                  {" "}
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />{" "}
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />{" "}
                </svg>
              </div>
              <p className="font-semibold text-lg">Sistema Escolar</p>
            </div>

            <nav className="flex items-center">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 space-x-1">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium rounded-md bg-white text-gray-900 shadow-sm border border-gray-200"
                >
                  Alumnos
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                  onClick={onNuevoAlumno}
                >
                  Crear
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
