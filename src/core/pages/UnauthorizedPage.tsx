import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MainLayout } from "../components/layout/MainLayout"; 
import { PublicLayout } from "../components/layout/PublicLayout";

const UnauthorizedContent: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center opacity-10 text-primary">
        <span className="text-[9rem] md:text-[16rem] font-extrabold leading-none">
          403
        </span>
      </div>

      <div className="relative z-10 max-w-xl mx-auto space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">
          Acceso Restringido
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          No tienes autorización
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
          No tienes los permisos necesarios para acceder a esta sección. Si crees que esto es un error, por favor contacta al administrador.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

// CAMBIO AQUÍ: Lo exportamos directamente como una constante nombrada
export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const content = <UnauthorizedContent />;

  // Muestra el layout con sidebar/navbar si está logueado, o el layout público si no
  return user ? (
    <MainLayout>{content}</MainLayout>
  ) : (
    <PublicLayout>{content}</PublicLayout>
  );
};