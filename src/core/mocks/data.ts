import type { UserRole } from "../constants/roles";

export interface Employee {
  id: string;
  name: string;
  email: string;
  function: string;
  department: string;
  status: "online" | "offline" | "vacation";
  employed: string;
  profilePicture: string | null;
  role: UserRole;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  medicalHistory: string;
  lastVisit: string;
  status: "available" | "unavailable";
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
}

export enum VacationReason {
  Vacations = "Vacations",
  SickLeave = "Sick Leave",
  PersonalLeave = "Personal Leave",
  MaternityLeave = "Maternity Leave",
  PaternityLeave = "Paternity Leave",
  FamilyVacation = "Family Vacation",
  MedicalLeave = "Medical Leave",
  Other = "Other",
}
export interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: VacationReason;
  comment?: string;
  status: "pending" | "approved" | "rejected" | "canceled";
  requestDate: string;
}

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Esthera Jackson",
    email: "esthera@example.com",
    function: "Admin",
    department: "Organization",
    status: "online",
    employed: "14/06/21",
    profilePicture: null,
    role: "admin",
  },
  {
    id: "2",
    name: "Alexa Liras",
    email: "alexa@example.com",
    function: "Doctor",
    department: "Neurology",
    status: "offline",
    employed: "14/06/21",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "3",
    name: "Laurent Michael",
    email: "laurent@example.com",
    function: "Executive",
    department: "Administrative",
    status: "online",
    employed: "14/06/21",
    profilePicture: null,
    role: "admin",
  },
  {
    id: "4",
    name: "Freduardo Hill",
    email: "freduardo@example.com",
    function: "Admin",
    department: "Organization",
    status: "online",
    employed: "14/06/21",
    profilePicture: null,
    role: "admin",
  },
  {
    id: "5",
    name: "Daniel Thomas",
    email: "daniel@example.com",
    function: "Doctor",
    department: "Neurology",
    status: "vacation",
    employed: "14/06/21",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "6",
    name: "Mark Wilson",
    email: "mark@example.com",
    function: "Doctor",
    department: "Neurology",
    status: "offline",
    employed: "14/06/21",
    profilePicture: null,
    role: "doctor",
  },
];

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Esthera Jackson",
    email: "esthera@example.com",
    phone: "+1 234 567 8901",
    reason: "Diabetes",
    medicalHistory: "Type 2 Diabetes",
    lastVisit: "14/06/21",
    status: "available",
  },
  {
    id: "2",
    name: "Alexa Liras",
    email: "alexa@example.com",
    phone: "+1 234 567 8902",
    reason: "Asthma",
    medicalHistory: "Chronic Asthma",
    lastVisit: "14/06/21",
    status: "unavailable",
  },
  {
    id: "3",
    name: "Laurent Michael",
    email: "laurent@example.com",
    phone: "+1 234 567 8903",
    reason: "COVID-19",
    medicalHistory: "COVID-19 Recovery",
    lastVisit: "14/06/21",
    status: "available",
  },
  {
    id: "4",
    name: "Freduardo Hill",
    email: "freduardo@example.com",
    phone: "+1 234 567 8904",
    reason: "Alzheimer's disease",
    medicalHistory: "Early Stage Alzheimer's",
    lastVisit: "14/06/21",
    status: "available",
  },
  {
    id: "5",
    name: "Daniel Thomas",
    email: "daniel@example.com",
    phone: "+1 234 567 8905",
    reason: "Parkinson's disease",
    medicalHistory: "Parkinson's Stage 2",
    lastVisit: "14/06/21",
    status: "unavailable",
  },
  {
    id: "6",
    name: "Mark Wilson",
    email: "mark@example.com",
    phone: "+1 234 567 8906",
    reason: "Hepatitis",
    medicalHistory: "Hepatitis B",
    lastVisit: "14/06/21",
    status: "unavailable",
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Patient 1",
    doctorId: "2",
    doctorName: "Doctor 1",
    date: "2026-02-26",
    time: "09:00",
    status: "scheduled",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Patient 2",
    doctorId: "2",
    doctorName: "Doctor 1",
    date: "2026-02-26",
    time: "10:00",
    status: "confirmed",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Patient 3",
    doctorId: "5",
    doctorName: "Doctor 2",
    date: "2026-02-26",
    time: "11:00",
    status: "scheduled",
  },
  {
    id: "4",
    patientId: "4",
    patientName: "Patient 4",
    doctorId: "6",
    doctorName: "Doctor 3",
    date: "2026-02-26",
    time: "14:00",
    status: "scheduled",
  },
  {
    id: "5",
    patientId: "5",
    patientName: "Patient 5",
    doctorId: "5",
    doctorName: "Doctor 2",
    date: "2026-02-27",
    time: "09:00",
    status: "scheduled",
  },
  {
    id: "6",
    patientId: "6",
    patientName: "Patient 6",
    doctorId: "6",
    doctorName: "Doctor 5",
    date: "2026-02-27",
    time: "10:00",
    status: "scheduled",
  },
];

export const mockVacationRequests: VacationRequest[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Esthera Jackson",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    days: 5,
    reason: VacationReason.FamilyVacation,
    status: "pending",
    requestDate: "2026-02-15",
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Alexa Liras",
    startDate: "2026-03-10",
    endDate: "2026-03-15",
    days: 6,
    reason: VacationReason.PersonalLeave,
    status: "pending",
    requestDate: "2026-02-18",
  },
  {
    id: "3",
    employeeId: "5",
    employeeName: "Daniel Thomas",
    startDate: "2026-02-26",
    endDate: "2026-03-02",
    days: 5,
    reason: VacationReason.MedicalLeave,
    status: "approved",
    requestDate: "2026-02-10",
  },
];

export interface VacationBalance {
  id: string;
  employeeId: string;
  assigned: number;
  used: number;
  available: number;
}

export const mockVacationBalances: VacationBalance[] = [
  { id: "1", employeeId: "1", assigned: 30, used: 5, available: 25 },
  { id: "2", employeeId: "2", assigned: 30, used: 10, available: 20 },
  { id: "3", employeeId: "5", assigned: 30, used: 15, available: 15 },
  { id: "4", employeeId: "6", assigned: 30, used: 0, available: 30 },
];

export const mockDashboardStats = {
  totalEmployees: 156,
  totalAppointments: 1104,
  activePatients: 892,
  pendingTasks: 23,
  vacationRequests: 3,
  employeesOnVacationToday: 2,
  returningNextWeek: 1,
};

export const ALLOWED_FILE_TYPES = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
