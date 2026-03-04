import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ALWAYS_ALLOWED_ROUTES,
  ROLE_ROUTE_ACCESS,
  ROUTE_PATHS,
  UNAUTHORIZED_ROUTE,
} from "./routes";

const normalizePath = (path: string) => {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
};

const isRouteAllowed = (path: string, allowedRoutes: string[]) =>
  allowedRoutes.some((allowedRoute) => {
    const normalizedAllowed = normalizePath(allowedRoute);

    if (normalizedAllowed === "/") {
      return path === "/";
    }

    return path === normalizedAllowed || path.startsWith(`${normalizedAllowed}/`);
  });

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={ROUTE_PATHS.LOGIN} replace state={{ from }} />;
  }

  const currentPath = normalizePath(location.pathname);

  if (isRouteAllowed(currentPath, ALWAYS_ALLOWED_ROUTES)) {
    return <Outlet />;
  }

  const allowedRoutes = ROLE_ROUTE_ACCESS[user.role] ?? [];

  if (!isRouteAllowed(currentPath, allowedRoutes)) {
    return <Navigate to={UNAUTHORIZED_ROUTE} replace />;
  }

  return <Outlet />;
};
