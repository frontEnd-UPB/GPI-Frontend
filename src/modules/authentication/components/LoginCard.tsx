import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { mockEmployees } from "../../../core/mocks/data";
import { Button, Card, CardContent } from "../../../core/components";
import { Shield, Stethoscope } from "lucide-react";

export const LoginCard: React.FC = () => {
  const { signIn, loading } = useAuth();

  const handleQuickLogin = async (employeeId: string) => {
    try {
      const employee = mockEmployees.find((emp) => emp.id === employeeId);
      if (!employee) return;

      if (!employee.password) {
        throw new Error("Demo password is missing for selected user");
      }

      const password = employee.password;
      await signIn({ email: employee.email, password });
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
    <Card className="w-full max-w-md">
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
  );
};