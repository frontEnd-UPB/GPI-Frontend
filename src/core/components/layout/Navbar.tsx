import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Stethoscope, Search, ChevronDown } from "lucide-react";
import { cn } from "../../../ui/utils";
import { Avatar } from "../../../ui/core/Avatar";
import { ProfileDropdown } from "./ProfileDropdown";
import type { UserRole } from "../../constants/roles";
import { ROUTE_PATHS } from "../../../routes/routes";

export interface NavbarLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps {
  role: UserRole;
  userName: string;
  userAvatar?: string;
  links: NavbarLink[];
  onProfileClick?: () => void;
  onSearchClick?: () => void;
}

const roleConfig: Record<UserRole, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeColor: string;
}> = {
  admin: {
    icon: Shield,
    label: "Admin",
    badgeColor: "bg-muted text-primary",
  },
  doctor: {
    icon: Stethoscope,
    label: "Doctor",
    badgeColor: "bg-muted text-primary",
  },
};
interface NavbarLinksProps {
  links: NavbarLink[];
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ links }) => {
  const location = useLocation();

  return (
    <div className="flex items-center gap-8">
      {links.map((link) => {
        const isActive = link.active ?? location.pathname === link.href;

        if (link.label === "Human Resources") {
          return (
            <HumanResourcesDropdown
              key={link.href}
              isActive={isActive}
            />
          );
        }

        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "text-base transition-colors",
              isActive
                ? "text-muted font-bold"
                : "text-primary-foreground font-normal hover:text-muted"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};

interface HumanResourcesDropdownProps {
  isActive: boolean;
}

const HumanResourcesDropdown: React.FC<HumanResourcesDropdownProps> = ({
  isActive,
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isHrActive =
    isActive ||
    location.pathname.startsWith(ROUTE_PATHS.HR) ||
    location.pathname.startsWith(ROUTE_PATHS.ADMIN_STAFF_DIRECTORY) ||
    location.pathname.startsWith(ROUTE_PATHS.ADMIN_VACATION_MANAGER);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-1 text-base transition-colors focus:outline-none",
          isHrActive
            ? "text-muted font-bold"
            : "text-primary-foreground font-normal hover:text-muted"
        )}
      >
        <span>Human Resources</span>
        <ChevronDown className="size-4" />
      </button>

      {/* Zona invisible que mantiene el hover en el espacio entre el texto y el menú */}
      <div className="absolute left-0 right-0 top-full h-10" />

      <div
        className={cn(
          "absolute left-0 top-full mt-10 w-56 rounded-2xl bg-primary text-primary-foreground shadow-lg py-2 transition-all duration-150",
          isOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 translate-y-1"
        )}
      >
        <Link
          to={ROUTE_PATHS.HR}
          className="block px-4 py-2 text-sm hover:bg-primary/80 rounded-t-2xl"
          onClick={handleClose}
        >
          Staff Directory
        </Link>
        <Link
          to={ROUTE_PATHS.ADMIN_VACATION_MANAGER}
          className="block px-4 py-2 text-sm hover:bg-primary/80 rounded-b-2xl"
          onClick={handleClose}
        >
          Vacation Manager
        </Link>
      </div>
    </div>
  );
};

interface ProfileMenuProps {
  role: UserRole;
  userName: string;
  userAvatar?: string;
  onProfileClick?: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  role,
  userName,
  userAvatar,
  onProfileClick,
}) => {
  const [open, setOpen] = useState(false);
  const config = roleConfig[role];
  const RoleIcon = config.icon;
  const safeUserName = userName?.trim() || "User";
  const userInitial = safeUserName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          onProfileClick?.();
        }}
        className="flex items-center gap-3 hover:bg-primary/80 rounded-lg px-3 py-2 transition-colors"
      >
        <Avatar src={userAvatar} alt={safeUserName} fallback={userInitial} />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium leading-tight">{safeUserName}</span>
          <div className="mt-1">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-medium",
                config.badgeColor
              )}
            >
              <RoleIcon className="size-3" />
              <span>{config.label}</span>
            </span>
          </div>
        </div>
      </button>
      {open && (
        <div className="absolute right-0 mt-4">
          <ProfileDropdown onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({
  role,
  userName,
  userAvatar,
  links,
  onProfileClick,
  onSearchClick,
}) => {
  return (
    <nav className="bg-primary text-primary-foreground relative z-20">
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between h-[77px]">
          <NavbarLinks links={links} />

          <div className="flex items-center gap-4">
            <button
              onClick={onSearchClick}
              className="p-2 hover:bg-primary/80 rounded-lg transition-colors"
            >
              <Search className="size-5" />
            </button>
            <ProfileMenu
              role={role}
              userName={userName}
              userAvatar={userAvatar}
              onProfileClick={onProfileClick}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar, NavbarLinks, ProfileMenu };
