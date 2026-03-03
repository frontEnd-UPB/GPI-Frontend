import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { mockEmployees } from "../../../core/mocks/data";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../../../core/components";
import { Shield, Stethoscope } from "lucide-react";
import { ROUTE_PATHS } from "../../../routes/routes";

type LoginLocationState = {
  from?: string;
};

const LoginPage: React.FC = () => {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LoginLocationState | null)?.from;
  const redirectTo = from && from !== ROUTE_PATHS.LOGIN ? from : ROUTE_PATHS.HOME;

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  const handleQuickLogin = async (employeeId: string) => {
    try {
      const employee = mockEmployees.find((emp) => emp.id === employeeId);
      if (!employee) return;

      // Use demo password based on role
      const password = employee.role === "admin" ? "admin123" : "doctor123";
      await signIn({ email: employee.email, password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const roleIcons = {
    admin: Shield,
    doctor: Stethoscope,
  };

  const adminUser = mockEmployees.find((emp) => emp.role === "admin");
  const doctorUser = mockEmployees.find((emp) => emp.role === "doctor");

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <p> .</p>
        <CardContent className="space-y-3">
          {adminUser && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => handleQuickLogin(adminUser.id)}
              disabled={loading}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-accent">
                {React.createElement(roleIcons.admin, {
                  className: "size-5 text-ring",
                })}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{adminUser.name}</p>
                <p className="text-xs text-muted-foreground">Admin · {adminUser.department}</p>
              </div>
            </Button>
          )}

          {doctorUser && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => handleQuickLogin(doctorUser.id)}
              disabled={loading}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-accent">
                {React.createElement(roleIcons.doctor, {
                  className: "size-5 text-ring",
                })}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{doctorUser.name}</p>
                <p className="text-xs text-muted-foreground">Doctor · {doctorUser.department}</p>
              </div>
            </Button>
          )}

          <div className="pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              This is a demo environment. Click any user to login.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
