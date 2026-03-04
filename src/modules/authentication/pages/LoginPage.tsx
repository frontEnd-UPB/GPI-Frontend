import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { mockEmployees } from "../../../core/mocks/data";
import { ROUTE_PATHS } from "../../../routes/routes";
import { LoginCard } from "../components/LoginCard";

type LoginLocationState = {
  from?: string;
};

const LoginPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LoginLocationState | null)?.from;
  const redirectTo = from && from !== ROUTE_PATHS.LOGIN ? from : ROUTE_PATHS.HOME;

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-muted flex items-center justify-center p-4">
      <LoginCard />
    </div>
  );
};

export default LoginPage;
