import React from "react";
import { Navbar, NavbarLink } from "./Navbar";
import { useAuth } from "../../../context/AuthContext";
import { ROUTE_PATHS } from "../../../routes/routes";

const doctorLinks: NavbarLink[] = [
  { label: "Home", href: ROUTE_PATHS.HOME },
  { label: "Agenda", href: ROUTE_PATHS.AGENDA },
  { label: "Patients", href: ROUTE_PATHS.PATIENTS },
  { label: "Pathology Results", href: ROUTE_PATHS.PATHOLOGY_RESULTS },
];

export const DoctorNavbar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Navbar
      role="doctor"
      userName={user.name}
      userAvatar={user.profilePicture || undefined}
      links={doctorLinks}
    />
  );
};
