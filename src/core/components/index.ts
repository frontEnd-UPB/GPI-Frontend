// UI Components (single layer: src/ui)
export { Button, buttonVariants } from "../../ui/core/Button";
export type { ButtonProps } from "../../ui/core/Button";

export { Badge, badgeVariants } from "../../ui/core/Badge";
export type { BadgeProps } from "../../ui/core/Badge";

export { Input } from "../../ui/core/Input";
export type { InputProps } from "../../ui/core/Input";

export { Textarea } from "../../ui/core/Textarea";
export type { TextareaProps } from "../../ui/core/Textarea";

export { Select } from "../../ui/core/Select";
export type { SelectProps, SelectOption } from "../../ui/core/Select";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../../ui/core/Card";
export type { CardProps } from "../../ui/core/Card";

export { SearchInput } from "../../ui/core/SearchInput";
export type { SearchInputProps } from "../../ui/core/SearchInput";

export { Avatar } from "../../ui/core/Avatar";
export type { AvatarProps } from "../../ui/core/Avatar";

export { Divider } from "../../ui/core/Divider";
export type { DividerProps } from "../../ui/core/Divider";

export { IconButton } from "../../ui/core/IconButton";
export type { IconButtonProps } from "../../ui/core/IconButton";

export { Modal } from "../../ui/core/Modal";
export type { ModalProps } from "../../ui/core/Modal";

export { DatePicker } from "../../ui/core/DatePicker";
export type { DatePickerProps } from "../../ui/core/DatePicker";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../../ui/core/Table";

// Layout Components
export { Navbar } from "./layout/Navbar";
export type { NavbarProps, NavbarLink } from "./layout/Navbar";

export type { UserRole } from "../constants/roles";

export { Footer } from "./layout/Footer";
export type { FooterProps } from "./layout/Footer";

export { TopInfoBar } from "./layout/TopInfoBar";
export type { TopInfoBarProps } from "./layout/TopInfoBar";

export { ProfileDropdown } from "./layout/ProfileDropdown";

export { AdminNavbar } from "./layout/AdminNavbar";
export { DoctorNavbar } from "./layout/DoctorNavbar";
export { MainLayout } from "./layout/MainLayout";
export { AdminLayout } from "./layout/AdminLayout";
export { DoctorLayout } from "./layout/DoctorLayout";
export { PublicLayout } from "./layout/PublicLayout";

export { PageHeader } from "./layout/PageHeader";
export type { PageHeaderProps } from "./layout/PageHeader";

export { MainContainer } from "./layout/MainContainer";
export type { MainContainerProps } from "./layout/MainContainer";

// Feedback Components
export { Loader } from "./feedback/Loader";
export type { LoaderProps } from "./feedback/Loader";

export { EmptyState } from "./feedback/EmptyState";
export type { EmptyStateProps } from "./feedback/EmptyState";

export { ErrorMessage } from "./feedback/ErrorMessage";
export type { ErrorMessageProps } from "./feedback/ErrorMessage";