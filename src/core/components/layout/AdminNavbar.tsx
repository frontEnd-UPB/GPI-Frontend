import React from "react";
import { Navbar, NavbarLink } from "./Navbar";
import { useAuth } from "../../../context/AuthContext";
import { ROUTE_PATHS } from "../../../routes/routes";

const adminLinks: NavbarLink[] = [
  { label: "Home", href: ROUTE_PATHS.HOME },
  { label: "Human Resources", href: ROUTE_PATHS.HR },
  { label: "Patients", href: ROUTE_PATHS.PATIENTS },
  { label: "Appointments", href: ROUTE_PATHS.APPOINTMENTS },
  { label: "Billing", href: ROUTE_PATHS.BILLING },
  { label: "Inventory", href: ROUTE_PATHS.INVENTORY },
];

export const AdminNavbar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Navbar
      role="admin"
      userName={user.name}
      userAvatar={user.profilePicture || undefined}
      links={adminLinks}
    />
  );
};
