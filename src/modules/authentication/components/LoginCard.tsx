import React from "react";
import { mockEmployees } from "../../../core/mocks/data";
import { Button, Card, CardContent } from "../../../core/components";
import { Shield, Stethoscope } from "lucide-react";
import { useSignIn } from "../hooks/useSignIn";
import { forgotPasswordService } from "../services/forgotPasswordService";

export const LoginCard: React.FC = () => {
  const { signIn: hookSignIn, signInLoading } = useSignIn();

  const handleQuickLogin = async (employeeId: string) => {
    try {
      const employee = mockEmployees.find((emp) => emp.id === employeeId);
      if (!employee) return;

      const password = forgotPasswordService.getMockPasswordForEmail(employee.email);

      if (!password) {
        throw new Error("Demo password is missing for selected user");
      }

      await hookSignIn(employee.email, password);
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
            disabled={signInLoading}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-accent">
              {React.createElement(roleIcons.admin, {
                className: "size-5 text-ring",
              })}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">
                {adminUser.name} - {adminUser.email}
              </p>
              <p className="text-xs text-muted-foreground">Admin · {adminUser.department}</p>
            </div>
          </Button>
        )}

        {doctorUser && (
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => handleQuickLogin(doctorUser.id)}
            disabled={signInLoading}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-accent">
              {React.createElement(roleIcons.doctor, {
                className: "size-5 text-ring",
              })}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">
                {doctorUser.name} - {doctorUser.email}
              </p>
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