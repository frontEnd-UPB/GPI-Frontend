import React from "react";
import { mockEmployees } from "../../../core/mocks/data";
import { Button } from "../../../core/components";
import { Shield, Stethoscope } from "lucide-react";

interface LoginCardProps {
  onSelectUser: (email: string, password: string) => void;
  disabled?: boolean;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onSelectUser, disabled }) => {
  const adminUser = mockEmployees.find((emp) => emp.role === "admin");
  const doctorUser = mockEmployees.find((emp) => emp.role === "doctor");

  return (
    <div className="w-[260px] bg-card rounded-xl shadow-lg border border-border p-4 space-y-3">

      {adminUser && (
        <Button
          variant="outline"
          className="w-full flex items-center gap-3 h-12 rounded-lg border-border hover:bg-muted transition"
          onClick={() => onSelectUser(adminUser.email, adminUser.password)}
          disabled={disabled}
        >
          <div className="flex items-center justify-center size-8 rounded-full bg-secondary/10">
            <Shield className="size-4 text-secondary" />
          </div>

          <div className="flex flex-col text-left leading-tight">
            <span className="text-sm font-semibold text-foreground">
              Admin Login
            </span>
            <span className="text-xs text-muted-foreground">
              {adminUser.firstname}
            </span>
          </div>
        </Button>
      )}

      {doctorUser && (
        <Button
          variant="outline"
          className="w-full flex items-center gap-3 h-12 rounded-lg border-border hover:bg-muted transition"
          onClick={() => onSelectUser(doctorUser.email, doctorUser.password)}
          disabled={disabled}
        >
          <div className="flex items-center justify-center size-8 rounded-full bg-secondary/10">
            <Stethoscope className="size-4 text-secondary" />
          </div>

          <div className="flex flex-col text-left leading-tight">
            <span className="text-sm font-semibold text-foreground">
              Doctor Login
            </span>
            <span className="text-xs text-muted-foreground">
              {doctorUser.firstname}
            </span>
          </div>
        </Button>
      )}
    </div>
  );
};