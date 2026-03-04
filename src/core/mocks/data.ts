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

export interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  rejectionReason?: string | null;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  comment: string | null;
  attachmentUrl: string | null;
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
    department: "Pediatrics",
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
    department: "Cardiology",
    status: "offline",
    employed: "14/06/21",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "7",
    name: "Laura Martínez",
    email: "laura.martinez@example.com",
    function: "Doctor",
    department: "General Medicine",
    status: "online",
    employed: "01/03/22",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "8",
    name: "Carlos Pérez",
    email: "carlos.perez@example.com",
    function: "Doctor",
    department: "Dermatology",
    status: "vacation",
    employed: "10/11/20",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "9",
    name: "María Gómez",
    email: "maria.gomez@example.com",
    function: "Doctor",
    department: "Gynecology",
    status: "online",
    employed: "05/09/23",
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
    reason: "Family vacation",
    status: "pending",
    requestDate: "2026-02-15",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Alexa Liras",
    startDate: "2026-03-10",
    endDate: "2026-03-15",
    days: 6,
    reason: "Personal leave",
    status: "pending",
    requestDate: "2026-02-18",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "3",
    employeeId: "5",
    employeeName: "Daniel Thomas",
    startDate: "2026-02-26",
    endDate: "2026-03-02",
    days: 5,
    reason: "Medical leave",
    status: "approved",
    requestDate: "2026-02-10",
    comment: "Medical leave approved by HR.",
    attachmentUrl: "https://example.com/docs/medical-leave-daniel-thomas.pdf",
  },
  {
    id: "4",
    employeeId: "2",
    employeeName: "Alexa Liras",
    startDate: "2026-03-20",
    endDate: "2026-03-25",
    days: 6,
    reason: "Conference attendance",
    status: "approved",
    requestDate: "2026-02-28",
    comment: "Conference trip confirmed and approved.",
    attachmentUrl: "https://example.com/docs/conference-alexa-liras.pdf",
  },
  {
    id: "5",
    employeeId: "8",
    employeeName: "Carlos Pérez",
    startDate: "2026-03-05",
    endDate: "2026-03-12",
    days: 8,
    reason: "Family trip",
    status: "pending",
    requestDate: "2026-03-01",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "6",
    employeeId: "7",
    employeeName: "Laura Martínez",
    startDate: "2026-03-15",
    endDate: "2026-03-18",
    days: 4,
    reason: "Personal leave",
    status: "rejected",
    rejectionReason: "High workload in Oncology department",
    requestDate: "2026-02-25",
    comment: "Request rejected due to high workload.",
    attachmentUrl: null,
  },
  {
    id: "7",
    employeeId: "3",
    employeeName: "Laurent Michael",
    startDate: "2026-03-22",
    endDate: "2026-03-24",
    days: 3,
    reason: "Short break",
    status: "pending",
    requestDate: "2026-03-02",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "8",
    employeeId: "4",
    employeeName: "Freduardo Hill",
    startDate: "2026-03-18",
    endDate: "2026-03-22",
    days: 5,
    reason: "Family visit",
    status: "pending",
    requestDate: "2026-03-02",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "9",
    employeeId: "9",
    employeeName: "María Gómez",
    startDate: "2026-03-26",
    endDate: "2026-03-30",
    days: 5,
    reason: "Travel",
    status: "pending",
    requestDate: "2026-03-02",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "10",
    employeeId: "6",
    employeeName: "Mark Wilson",
    startDate: "2026-03-05",
    endDate: "2026-03-08",
    days: 4,
    reason: "Cardiology conference",
    status: "approved",
    requestDate: "2026-02-20",
    comment: "Approved to attend annual cardiology summit.",
    attachmentUrl: "https://example.com/docs/cardiology-conference-mark-wilson.pdf",
  },
  {
    id: "11",
    employeeId: "7",
    employeeName: "Laura Martínez",
    startDate: "2026-03-25",
    endDate: "2026-03-29",
    days: 5,
    reason: "Family vacation",
    status: "approved",
    requestDate: "2026-02-22",
    comment: "Family vacation scheduled after shift reorganization.",
    attachmentUrl: null,
  },
  {
    id: "12",
    employeeId: "8",
    employeeName: "Carlos Pérez",
    startDate: "2026-02-18",
    endDate: "2026-02-22",
    days: 5,
    reason: "Post-congress rest days",
    status: "approved",
    requestDate: "2026-03-05",
    comment: "Approved as compensation after international congress.",
    attachmentUrl: "https://example.com/docs/post-congress-rest-carlos-perez.pdf",
  },
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
