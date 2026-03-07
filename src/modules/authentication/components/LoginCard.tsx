import React from "react";
import { mockEmployees } from "../../../core/mocks/data";
import { Button, Card, CardContent } from "../../../core/components";
import { Shield, Stethoscope } from "lucide-react";

interface LoginCardProps {
  onSelectUser: (email: string, password: string) => void;
  disabled?: boolean;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onSelectUser, disabled }) => {

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
            onClick={() => onSelectUser(adminUser.email, adminUser.password)}
            disabled={disabled}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-accent">
              {React.createElement(roleIcons.admin, {
                className: "size-5 text-ring",
              })}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">
                {`${adminUser.firstname} ${adminUser.lastname}`.trim()} - {adminUser.email}
              </p>
              <p className="text-xs text-muted-foreground">Admin · {adminUser.department}</p>
            </div>
          </Button>
        )}

        {doctorUser && (
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => onSelectUser(doctorUser.email, doctorUser.password)}
            disabled={disabled}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-accent">
              {React.createElement(roleIcons.doctor, {
                className: "size-5 text-ring",
              })}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">
                {`${doctorUser.firstname} ${doctorUser.lastname}`.trim()} - {doctorUser.email}
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