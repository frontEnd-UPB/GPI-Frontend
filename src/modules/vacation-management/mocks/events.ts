export type VacationEvent = {
  id: string;
  doctorName: string;
  specialty: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string; // ISO date string YYYY-MM-DD
};

// Mock vacation events for the calendar. Keep data local to this module.
export const vacationEvents: VacationEvent[] = [
  {
    id: "evt-1",
    doctorName: "Robert Diches",
    specialty: "Dermatology",
    startDate: "2026-02-07",
    endDate: "2026-02-09",
  },
  {
    id: "evt-2",
    doctorName: "Alexander Mitchell",
    specialty: "Cardiology",
    startDate: "2026-02-16",
    endDate: "2026-02-20",
  },
  {
    id: "evt-3",
    doctorName: "Monica James",
    specialty: "Pediatrics",
    startDate: "2026-02-18",
    endDate: "2026-02-18",
  },
  {
    id: "evt-4",
    doctorName: "Nicholas Rigs",
    specialty: "Neurology",
    startDate: "2026-03-01",
    endDate: "2026-03-02",
  },
];
