import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, CalendarDays, UserCog, PlaneTakeoff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useSignOut } from "../../../modules/authentication/hooks/useSignOut";
import { cn } from "../../../ui/utils";
import { ROUTE_PATHS } from "../../../routes/routes";

interface ProfileDropdownProps {
  onClose?: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { signOut: hookSignOut } = useSignOut();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  if (!user) return null;

  const handleSignOut = async () => {
    await hookSignOut();
    onClose?.();
  };

  useEffect(() => {
    if (!onClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleRequestVacations = () => {
    if (user.role === "doctor") {
      navigate(ROUTE_PATHS.VACATIONS_DOCTOR);
    } else if (user.role === "admin") {
      navigate(ROUTE_PATHS.VACATIONS_ADMIN);
    } else {
      navigate(ROUTE_PATHS.UNAUTHORIZED);
    }
    onClose?.();
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "w-72 rounded-2xl bg-card text-card-foreground shadow-lg border border-border",
        "py-4 text-sm"
      )}
    >
      <div className="px-4 pb-3">
        <p className="font-semibold text-[15px] leading-tight">
          {user.name}
        </p>
        <p className="text-[13px] text-muted-foreground truncate">
          {user.email}
        </p>
      </div>
      <div className="h-px bg-border my-2" />
      <nav className="flex flex-col">
        <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-left">
          <UserCog className="size-4" />
          <span>Profile Settings</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-left">
          <CalendarDays className="size-4" />
          <span>Agenda</span>
        </button>
        <button
          onClick={handleRequestVacations}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-left"
        >
          <PlaneTakeoff className="size-4" />
          <span>Request Vacations</span>
        </button>
      </nav>
      <div className="h-px bg-border my-2" />
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-left w-full text-destructive"
      >
        <LogOut className="size-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};
