import type { UserRole } from "../constants/roles";
import { VACATION_STATUS, APPOINTMENT_STATUS, EMPLOYEE_STATUS } from "../constants";

export interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  start_date: string;
  status: (typeof EMPLOYEE_STATUS)[keyof typeof EMPLOYEE_STATUS];
  speciality: string;
  department: string;
  profilePicture: string | null;
  role: UserRole;
}

export interface Patient {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  dateofbirth: string;
  phone: string;
  reason: string;
  lastVisit: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  reason: string;
  status: (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  rejectionReason?: string | null;
  reason: string;
  status: (typeof VACATION_STATUS)[keyof typeof VACATION_STATUS];
  requestDate: string;
  comment: string | null;
  attachmentUrl: string | null;
  attachmentName?: string | null;
}

export const mockEmployees: Employee[] = [
  {
    id: "1",
    firstname: "Esthera",
    lastname: "Jackson",
    email: "esthera@example.com",
    password: "Password123!",
    phone: "+1 234 567 8900",
    start_date: "2021-06-14",
    status: EMPLOYEE_STATUS.ONLINE,
    speciality: "Administration",
    department: "Organization",
    profilePicture: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=687&auto=format&fit=crop",
    role: "admin",
  },
  {
    id: "2",
    firstname: "Alexa",
    lastname: "Liras",
    email: "alexa@example.com",
    password: "Password123!",
    phone: "+1 234 567 8901",
    start_date: "2021-06-14",
    status: EMPLOYEE_STATUS.OFFLINE,
    speciality: "Pediatrics",
    department: "Pediatrics",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "3",
    firstname: "Laurent",
    lastname: "Michael",
    email: "laurent@example.com",
    password: "Password123!",
    phone: "+1 234 567 8902",
    start_date: "2021-06-14",
    status: EMPLOYEE_STATUS.ONLINE,
    speciality: "Management",
    department: "Administrative",
    profilePicture: null,
    role: "admin",
  },
  {
    id: "4",
    firstname: "Freduardo",
    lastname: "Hill",
    email: "freduardo@example.com",
    password: "Password123!",
    phone: "+1 234 567 8903",
    start_date: "2021-06-14",
    status: EMPLOYEE_STATUS.ONLINE,
    speciality: "Administration",
    department: "Organization",
    profilePicture: null,
    role: "admin",
  },
  {
    id: "5",
    firstname: "Daniel",
    lastname: "Thomas",
    email: "daniel@example.com",
    password: "Password123!",
    phone: "+1 234 567 8904",
    start_date: "2021-06-14",
    status: EMPLOYEE_STATUS.VACATION,
    speciality: "Neurology",
    department: "Neurology",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "6",
    firstname: "Mark",
    lastname: "Wilson",
    email: "mark@example.com",
    password: "Password123!",
    phone: "+1 234 567 8905",
    start_date: "2021-06-14",
    status: EMPLOYEE_STATUS.OFFLINE,
    speciality: "Cardiology",
    department: "Cardiology",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "7",
    firstname: "Laura",
    lastname: "Martínez",
    email: "laura.martinez@example.com",
    password: "Password123!",
    phone: "+1 234 567 8906",
    start_date: "2022-03-01",
    status: EMPLOYEE_STATUS.ONLINE,
    speciality: "General Medicine",
    department: "General Medicine",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "8",
    firstname: "Carlos",
    lastname: "Pérez",
    email: "carlos.perez@example.com",
    password: "Password123!",
    phone: "+1 234 567 8907",
    start_date: "2020-11-10",
    status: EMPLOYEE_STATUS.VACATION,
    speciality: "Dermatology",
    department: "Dermatology",
    profilePicture: null,
    role: "doctor",
  },
  {
    id: "9",
    firstname: "María",
    lastname: "Gómez",
    password: "Password123!",
    email: "maria.gomez@example.com",
    phone: "+1 234 567 8908",
    start_date: "2023-09-05",
    status: EMPLOYEE_STATUS.ONLINE,
    speciality: "Gynecology",
    department: "Gynecology",
    profilePicture: null,
    role: "doctor",
  },
];

export const mockPatients: Patient[] = [
{ id:"1", firstname:"John", lastname:"Smith", email:"john.smith@example.com", password:"Password123!", dateofbirth:"1988-02-10", phone:"+1 555 1001", reason:"General consultation", lastVisit:"2026-02-10"},
{ id:"2", firstname:"Emma", lastname:"Johnson", email:"emma.johnson@example.com", password:"Password123!", dateofbirth:"1991-06-12", phone:"+1 555 1002", reason:"Routine checkup", lastVisit:"2026-02-12"},
{ id:"3", firstname:"Liam", lastname:"Brown", email:"liam.brown@example.com", password:"Password123!", dateofbirth:"1985-09-02", phone:"+1 555 1003", reason:"Back pain", lastVisit:"2026-02-15"},
{ id:"4", firstname:"Olivia", lastname:"Davis", email:"olivia.davis@example.com", password:"Password123!", dateofbirth:"1993-01-14", phone:"+1 555 1004", reason:"Headache", lastVisit:"2026-02-17"},
{ id:"5", firstname:"Noah", lastname:"Miller", email:"noah.miller@example.com", password:"Password123!", dateofbirth:"1987-11-01", phone:"+1 555 1005", reason:"Skin rash", lastVisit:"2026-02-20"},
{ id:"6", firstname:"Ava", lastname:"Wilson", email:"ava.wilson@example.com", password:"Password123!", dateofbirth:"1994-03-22", phone:"+1 555 1006", reason:"Allergy", lastVisit:"2026-02-22"},
{ id:"7", firstname:"Lucas", lastname:"Moore", email:"lucas.moore@example.com", password:"Password123!", dateofbirth:"1982-12-12", phone:"+1 555 1007", reason:"Chest pain", lastVisit:"2026-02-25"},
{ id:"8", firstname:"Sophia", lastname:"Taylor", email:"sophia.taylor@example.com", password:"Password123!", dateofbirth:"1996-07-30", phone:"+1 555 1008", reason:"Routine checkup", lastVisit:"2026-02-26"},
{ id:"9", firstname:"James", lastname:"Anderson", email:"james.anderson@example.com", password:"Password123!", dateofbirth:"1989-04-04", phone:"+1 555 1009", reason:"Knee pain", lastVisit:"2026-02-27"},
{ id:"10", firstname:"Mia", lastname:"Thomas", email:"mia.thomas@example.com", password:"Password123!", dateofbirth:"1995-10-10", phone:"+1 555 1010", reason:"Consultation", lastVisit:"2026-02-28"},
{ id:"11", firstname:"Benjamin", lastname:"Jackson", email:"benjamin.jackson@example.com", password:"Password123!", dateofbirth:"1986-05-01", phone:"+1 555 1011", reason:"Routine checkup", lastVisit:"2026-02-11"},
{ id:"12", firstname:"Charlotte", lastname:"White", email:"charlotte.white@example.com", password:"Password123!", dateofbirth:"1992-08-12", phone:"+1 555 1012", reason:"Migraine", lastVisit:"2026-02-12"},
{ id:"13", firstname:"Henry", lastname:"Harris", email:"henry.harris@example.com", password:"Password123!", dateofbirth:"1983-09-15", phone:"+1 555 1013", reason:"General consultation", lastVisit:"2026-02-13"},
{ id:"14", firstname:"Amelia", lastname:"Martin", email:"amelia.martin@example.com", password:"Password123!", dateofbirth:"1997-03-08", phone:"+1 555 1014", reason:"Skin allergy", lastVisit:"2026-02-14"},
{ id:"15", firstname:"Alexander", lastname:"Thompson", email:"alexander.thompson@example.com", password:"Password123!", dateofbirth:"1984-11-22", phone:"+1 555 1015", reason:"Checkup", lastVisit:"2026-02-15"},
{ id:"16", firstname:"Ella", lastname:"Garcia", email:"ella.garcia@example.com", password:"Password123!", dateofbirth:"1998-12-03", phone:"+1 555 1016", reason:"Cold symptoms", lastVisit:"2026-02-16"},
{ id:"17", firstname:"Daniel", lastname:"Martinez", email:"daniel.martinez@example.com", password:"Password123!", dateofbirth:"1987-02-18", phone:"+1 555 1017", reason:"Neurology consult", lastVisit:"2026-02-17"},
{ id:"18", firstname:"Scarlett", lastname:"Robinson", email:"scarlett.robinson@example.com", password:"Password123!", dateofbirth:"1991-04-29", phone:"+1 555 1018", reason:"Routine exam", lastVisit:"2026-02-18"},
{ id:"19", firstname:"Matthew", lastname:"Clark", email:"matthew.clark@example.com", password:"Password123!", dateofbirth:"1980-10-10", phone:"+1 555 1019", reason:"Cardiology consult", lastVisit:"2026-02-19"},
{ id:"20", firstname:"Victoria", lastname:"Rodriguez", email:"victoria.rodriguez@example.com", password:"Password123!", dateofbirth:"1993-09-01", phone:"+1 555 1020", reason:"Gynecology consult", lastVisit:"2026-02-20"},
{ id:"21", firstname:"Jack", lastname:"Lewis", email:"jack.lewis@example.com", password:"Password123!", dateofbirth:"1989-07-07", phone:"+1 555 1021", reason:"Checkup", lastVisit:"2026-02-21"},
{ id:"22", firstname:"Chloe", lastname:"Lee", email:"chloe.lee@example.com", password:"Password123!", dateofbirth:"1996-06-12", phone:"+1 555 1022", reason:"Headache", lastVisit:"2026-02-22"},
{ id:"23", firstname:"Sebastian", lastname:"Walker", email:"sebastian.walker@example.com", password:"Password123!", dateofbirth:"1985-01-30", phone:"+1 555 1023", reason:"Back pain", lastVisit:"2026-02-23"},
{ id:"24", firstname:"Grace", lastname:"Hall", email:"grace.hall@example.com", password:"Password123!", dateofbirth:"1994-05-16", phone:"+1 555 1024", reason:"Allergy", lastVisit:"2026-02-24"},
{ id:"25", firstname:"David", lastname:"Allen", email:"david.allen@example.com", password:"Password123!", dateofbirth:"1983-08-20", phone:"+1 555 1025", reason:"Routine exam", lastVisit:"2026-02-25"},
{ id:"26", firstname:"Lily", lastname:"Young", email:"lily.young@example.com", password:"Password123!", dateofbirth:"1998-11-05", phone:"+1 555 1026", reason:"Consultation", lastVisit:"2026-02-26"},
{ id:"27", firstname:"Joseph", lastname:"King", email:"joseph.king@example.com", password:"Password123!", dateofbirth:"1982-03-13", phone:"+1 555 1027", reason:"Chest pain", lastVisit:"2026-02-27"},
{ id:"28", firstname:"Aria", lastname:"Scott", email:"aria.scott@example.com", password:"Password123!", dateofbirth:"1995-12-12", phone:"+1 555 1028", reason:"Checkup", lastVisit:"2026-02-28"},
{ id:"29", firstname:"Samuel", lastname:"Green", email:"samuel.green@example.com", password:"Password123!", dateofbirth:"1986-02-01", phone:"+1 555 1029", reason:"Skin issue", lastVisit:"2026-02-20"},
{ id:"30", firstname:"Hannah", lastname:"Adams", email:"hannah.adams@example.com", password:"Password123!", dateofbirth:"1997-04-14", phone:"+1 555 1030", reason:"Routine exam", lastVisit:"2026-02-21"},
{ id:"31", firstname:"Leo", lastname:"Baker", email:"leo.baker@example.com", password:"Password123!", dateofbirth:"1989-03-12", phone:"+1 555 1031", reason:"Consultation", lastVisit:"2026-02-21"},
{ id:"32", firstname:"Zoe", lastname:"Nelson", email:"zoe.nelson@example.com", password:"Password123!", dateofbirth:"1993-09-17", phone:"+1 555 1032", reason:"Allergy", lastVisit:"2026-02-21"},
{ id:"33", firstname:"Isaac", lastname:"Carter", email:"isaac.carter@example.com", password:"Password123!", dateofbirth:"1984-06-30", phone:"+1 555 1033", reason:"Back pain", lastVisit:"2026-02-21"},
{ id:"34", firstname:"Natalie", lastname:"Mitchell", email:"natalie.mitchell@example.com", password:"Password123!", dateofbirth:"1995-01-04", phone:"+1 555 1034", reason:"Checkup", lastVisit:"2026-02-21"},
{ id:"35", firstname:"Aaron", lastname:"Perez", email:"aaron.perez@example.com", password:"Password123!", dateofbirth:"1987-12-11", phone:"+1 555 1035", reason:"Consultation", lastVisit:"2026-02-21"},
{ id:"36", firstname:"Layla", lastname:"Roberts", email:"layla.roberts@example.com", password:"Password123!", dateofbirth:"1996-03-02", phone:"+1 555 1036", reason:"Routine exam", lastVisit:"2026-02-21"},
{ id:"37", firstname:"Owen", lastname:"Turner", email:"owen.turner@example.com", password:"Password123!", dateofbirth:"1983-04-18", phone:"+1 555 1037", reason:"Chest pain", lastVisit:"2026-02-21"},
{ id:"38", firstname:"Aurora", lastname:"Phillips", email:"aurora.phillips@example.com", password:"Password123!", dateofbirth:"1998-05-25", phone:"+1 555 1038", reason:"Consultation", lastVisit:"2026-02-21"},
{ id:"39", firstname:"Wyatt", lastname:"Campbell", email:"wyatt.campbell@example.com", password:"Password123!", dateofbirth:"1981-07-13", phone:"+1 555 1039", reason:"Routine exam", lastVisit:"2026-02-21"},
{ id:"40", firstname:"Stella", lastname:"Parker", email:"stella.parker@example.com", password:"Password123!", dateofbirth:"1992-10-09", phone:"+1 555 1040", reason:"Checkup", lastVisit:"2026-02-21"},
{ id:"41", firstname:"Luke", lastname:"Evans", email:"luke.evans@example.com", password:"Password123!", dateofbirth:"1986-02-22", phone:"+1 555 1041", reason:"Consultation", lastVisit:"2026-02-21"},
{ id:"42", firstname:"Hazel", lastname:"Edwards", email:"hazel.edwards@example.com", password:"Password123!", dateofbirth:"1994-07-30", phone:"+1 555 1042", reason:"Headache", lastVisit:"2026-02-21"},
{ id:"43", firstname:"Julian", lastname:"Collins", email:"julian.collins@example.com", password:"Password123!", dateofbirth:"1985-08-15", phone:"+1 555 1043", reason:"Back pain", lastVisit:"2026-02-21"},
{ id:"44", firstname:"Violet", lastname:"Stewart", email:"violet.stewart@example.com", password:"Password123!", dateofbirth:"1997-12-01", phone:"+1 555 1044", reason:"Routine exam", lastVisit:"2026-02-21"},
{ id:"45", firstname:"Nathan", lastname:"Sanchez", email:"nathan.sanchez@example.com", password:"Password123!", dateofbirth:"1988-05-05", phone:"+1 555 1045", reason:"Consultation", lastVisit:"2026-02-21"},
{ id:"46", firstname:"Luna", lastname:"Morris", email:"luna.morris@example.com", password:"Password123!", dateofbirth:"1996-06-19", phone:"+1 555 1046", reason:"Allergy", lastVisit:"2026-02-21"},
{ id:"47", firstname:"Christopher", lastname:"Rogers", email:"christopher.rogers@example.com", password:"Password123!", dateofbirth:"1983-11-11", phone:"+1 555 1047", reason:"Chest pain", lastVisit:"2026-02-21"},
{ id:"48", firstname:"Penelope", lastname:"Reed", email:"penelope.reed@example.com", password:"Password123!", dateofbirth:"1992-04-21", phone:"+1 555 1048", reason:"Routine exam", lastVisit:"2026-02-21"},
{ id:"49", firstname:"Isaiah", lastname:"Cook", email:"isaiah.cook@example.com", password:"Password123!", dateofbirth:"1987-09-17", phone:"+1 555 1049", reason:"Consultation", lastVisit:"2026-02-21"},
{ id:"50", firstname:"Riley", lastname:"Morgan", email:"riley.morgan@example.com", password:"Password123!", dateofbirth:"1995-03-10", phone:"+1 555 1050", reason:"Checkup", lastVisit:"2026-02-21"}
];

export const mockAppointments: Appointment[] = [
{ id:"1", patientId:"1", doctorId:"2", date:"2026-03-02T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"2", patientId:"2", doctorId:"5", date:"2026-03-02T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"3", patientId:"3", doctorId:"6", date:"2026-03-02T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"4", patientId:"4", doctorId:"7", date:"2026-03-02T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"5", patientId:"5", doctorId:"8", date:"2026-03-03T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"6", patientId:"6", doctorId:"9", date:"2026-03-03T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"7", patientId:"7", doctorId:"2", date:"2026-03-03T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"8", patientId:"8", doctorId:"5", date:"2026-03-03T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"9", patientId:"9", doctorId:"6", date:"2026-03-04T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"10", patientId:"10", doctorId:"7", date:"2026-03-04T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"11", patientId:"11", doctorId:"8", date:"2026-03-04T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"12", patientId:"12", doctorId:"9", date:"2026-03-04T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"13", patientId:"13", doctorId:"2", date:"2026-03-05T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"14", patientId:"14", doctorId:"5", date:"2026-03-05T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"15", patientId:"15", doctorId:"6", date:"2026-03-05T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"16", patientId:"16", doctorId:"7", date:"2026-03-05T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"17", patientId:"17", doctorId:"8", date:"2026-03-06T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"18", patientId:"18", doctorId:"9", date:"2026-03-06T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"19", patientId:"19", doctorId:"2", date:"2026-03-06T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"20", patientId:"20", doctorId:"5", date:"2026-03-06T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"21", patientId:"21", doctorId:"6", date:"2026-03-09T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"22", patientId:"22", doctorId:"7", date:"2026-03-09T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"23", patientId:"23", doctorId:"8", date:"2026-03-09T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"24", patientId:"24", doctorId:"9", date:"2026-03-09T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"25", patientId:"25", doctorId:"2", date:"2026-03-10T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"26", patientId:"26", doctorId:"5", date:"2026-03-10T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"27", patientId:"27", doctorId:"6", date:"2026-03-10T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"28", patientId:"28", doctorId:"7", date:"2026-03-10T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"29", patientId:"29", doctorId:"8", date:"2026-03-11T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"30", patientId:"30", doctorId:"9", date:"2026-03-11T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"31", patientId:"31", doctorId:"2", date:"2026-03-11T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"32", patientId:"32", doctorId:"5", date:"2026-03-11T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"33", patientId:"33", doctorId:"6", date:"2026-03-12T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"34", patientId:"34", doctorId:"7", date:"2026-03-12T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"35", patientId:"35", doctorId:"8", date:"2026-03-12T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"36", patientId:"36", doctorId:"9", date:"2026-03-12T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"37", patientId:"37", doctorId:"2", date:"2026-03-13T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"38", patientId:"38", doctorId:"5", date:"2026-03-13T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"39", patientId:"39", doctorId:"6", date:"2026-03-13T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"40", patientId:"40", doctorId:"7", date:"2026-03-13T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"41", patientId:"41", doctorId:"8", date:"2026-03-16T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"42", patientId:"42", doctorId:"9", date:"2026-03-16T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"43", patientId:"43", doctorId:"2", date:"2026-03-16T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"44", patientId:"44", doctorId:"5", date:"2026-03-16T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"45", patientId:"45", doctorId:"6", date:"2026-03-17T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"46", patientId:"46", doctorId:"7", date:"2026-03-17T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"47", patientId:"47", doctorId:"8", date:"2026-03-17T11:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"48", patientId:"48", doctorId:"9", date:"2026-03-17T14:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },

{ id:"49", patientId:"49", doctorId:"2", date:"2026-03-18T09:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
{ id:"50", patientId:"50", doctorId:"5", date:"2026-03-18T10:00:00", reason:"Consultation", status:APPOINTMENT_STATUS.SCHEDULED },
];

export const mockOtpCode = "1234";

export const mockVacationRequests: VacationRequest[] = [
  {
    id: "1",
    employeeId: "1",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    reason: "Family vacation",
    status: VACATION_STATUS.PENDING,
    requestDate: "2026-02-15",
    comment:
      "I need to take some time off to take care of family matters and spend time with my relatives who will be visiting during this period.",
    rejectionReason: null,
    attachmentUrl: "https://example.com/docs/family-vacation-request.pdf",
  },

  {
    id: "2",
    employeeId: "1",
    startDate: "2026-04-10",
    endDate: "2026-04-14",
    reason: "Personal travel",
    status: VACATION_STATUS.APPROVED,
    requestDate: "2026-03-20",
    comment:
      "I will be traveling out of the city for a few days and would like to schedule my vacation accordingly.",
    rejectionReason: null,
    attachmentUrl: "https://example.com/docs/travel-plan.pdf",
  },

  {
    id: "3",
    employeeId: "1",
    startDate: "2026-05-03",
    endDate: "2026-05-06",
    reason: "Medical appointment",
    status: VACATION_STATUS.REJECTED,
    requestDate: "2026-04-10",
    comment:
      "I requested these days off to attend several medical appointments that require travel.",
    rejectionReason:
      "The requested dates overlap with a critical project delivery and staffing levels cannot support the absence.",
    attachmentUrl: "https://example.com/docs/medical-appointment.pdf",
  },

  {
    id: "4",
    employeeId: "1",
    startDate: "2026-06-15",
    endDate: "2026-06-20",
    reason: "Trip with friends",
    status: VACATION_STATUS.CANCELLED,
    requestDate: "2026-05-01",
    comment:
      "Originally planned a short trip with friends, but the trip has been canceled so the vacation request is withdrawn.",
    rejectionReason: null,
    attachmentUrl: null,
  },
  {
    id: "5",
    employeeId: "2",
    startDate: "2026-03-10",
    endDate: "2026-03-15",
    reason: "Personal leave",
    status: VACATION_STATUS.PENDING,
    requestDate: "2026-02-18",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "6",
    employeeId: "5",
    startDate: "2026-02-26",
    endDate: "2026-03-02",
    reason: "Medical leave",
    status: VACATION_STATUS.APPROVED,
    requestDate: "2026-02-10",
    comment: "Medical leave approved by HR.",
    attachmentUrl: "https://example.com/docs/medical-leave-daniel-thomas.pdf",
  },
  {
    id: "7",
    employeeId: "2",
    startDate: "2026-03-20",
    endDate: "2026-03-25",
    reason: "Conference attendance",
    status: VACATION_STATUS.APPROVED,
    requestDate: "2026-02-28",
    comment: "Conference trip confirmed and approved.",
    attachmentUrl: "https://example.com/docs/conference-alexa-liras.pdf",
  },
  {
    id: "8",
    employeeId: "8",
    startDate: "2026-03-05",
    endDate: "2026-03-12",
    reason: "Sickness",
    status: VACATION_STATUS.PENDING,
    requestDate: "2026-03-01",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "16",
    employeeId: "7",
    startDate: "2026-03-15",
    endDate: "2026-03-18",
    reason: "Personal leave",
    status: VACATION_STATUS.REJECTED,
    rejectionReason: "High workload in Oncology department",
    requestDate: "2026-02-25",
    comment: "Request rejected due to high workload.",
    attachmentUrl: null,
  },
  {
    id: "9",
    employeeId: "3",
    startDate: "2026-03-22",
    endDate: "2026-03-24",
    reason: "Short break",
    status: VACATION_STATUS.PENDING,
    requestDate: "2026-03-02",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "10",
    employeeId: "4",
    startDate: "2026-03-18",
    endDate: "2026-03-22",
    reason: "Family visit",
    status: VACATION_STATUS.PENDING,
    requestDate: "2026-03-02",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "11",
    employeeId: "9",
    startDate: "2026-03-26",
    endDate: "2026-03-30",
    reason: "Travel",
    status: VACATION_STATUS.PENDING,
    requestDate: "2026-03-02",
    comment: null,
    attachmentUrl: null,
  },
  {
    id: "12",
    employeeId: "6",
    startDate: "2026-03-05",
    endDate: "2026-03-08",
    reason: "Cardiology conference",
    status: VACATION_STATUS.APPROVED,
    requestDate: "2026-02-20",
    comment: "Approved to attend annual cardiology summit.",
    attachmentUrl: "https://example.com/docs/cardiology-conference-mark-wilson.pdf",
  },
  {
    id: "13",
    employeeId: "7",
    startDate: "2026-03-25",
    endDate: "2026-03-29",
    reason: "Family vacation",
    status: VACATION_STATUS.APPROVED,
    requestDate: "2026-02-22",
    comment: "Family vacation scheduled after shift reorganization.",
    attachmentUrl: null,
  },
  {
    id: "14",
    employeeId: "8",
    startDate: "2026-02-18",
    endDate: "2026-02-22",
    reason: "Post-congress rest days",
    status: VACATION_STATUS.APPROVED,
    requestDate: "2026-03-05",
    comment: "Approved as compensation after international congress.",
    attachmentUrl: "https://example.com/docs/post-congress-rest-carlos-perez.pdf",
  },
  {
    id: "15",
    employeeId: "2",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    reason: "Short personal trip",
    status: VACATION_STATUS.CANCELLED,
    requestDate: "2026-03-20",
    comment: "Cancelled by employee due to schedule change.",
    attachmentUrl: null,
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
