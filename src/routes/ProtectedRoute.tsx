import { Navigate, Outlet, useLocation } from 'react-router-dom';
// Asegúrate de que useAuth provenga de aquí (o de src/core/hooks si lo exportas desde ahí)
import { useAuth } from '../context/AuthContext'; 
// Importando el Loader desde la ubicación exacta que detecté
import { Loader } from '../core/components/feedback/Loader';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[]; // Array opcional con los roles permitidos
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  // 1. Verificación de sesión activa
  if (!user) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // 2. Verificación de rol del usuario
  // Se asume que 'user' tiene una propiedad 'role'. Ajusta 'user.role' según tu interfaz en src/core/types/auth.ts
  if (allowedRoles && user && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si tiene sesión y el rol es correcto, renderiza la vista solicitada
  return <>{children ?? <Outlet />}</>;
};