import React, { useState } from "react";
import { Card } from "../../../../ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockAppointments, mockPatients } from "../../../../core/mocks/data";
import { APPOINTMENT_STATUS } from "../../../../core/constants";

interface AppointmentItem {
  patientName: string;
  timeLabel: string;
  dateTime: Date;
}

interface DayAgenda {
  dayName: string;
  dayNumber: number;
  date: string;
  appointments: AppointmentItem[];
}

export function AppointmentsCalendar({ doctorId }: { doctorId?: string }) {
  // Filtrar por doctor (si se pasa) y por status SCHEDULED
  const filteredAll = mockAppointments.filter((appointment) => {
    if (doctorId && appointment.doctorId !== doctorId) return false;
    return appointment.status === APPOINTMENT_STATUS.SCHEDULED;
  });

  const parseLocalDate = (dateTimeStr: string) => {
    const [datePart] = dateTimeStr.split("T");
    const [y, m, d] = datePart.split("-").map((v) => Number(v));
    return new Date(y, m - 1, d);
  };

  const parseLocalDateTime = (dateTimeStr: string) => {
    const [datePart, timePart] = dateTimeStr.split("T");
    const [y, m, d] = datePart.split("-").map((v) => Number(v));
    if (!timePart) return new Date(y, m - 1, d);
    const [hh, mm] = timePart.split(":").map((v) => Number(v));
    return new Date(y, m - 1, d, hh, mm || 0);
  };

  const initialMonth = filteredAll.length
    ? parseLocalDate(filteredAll.map((a) => a.date).sort()[0])
    : new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));

  const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Filter by doctor and by selected month (use local date parsing to avoid timezone shifts)
  const filtered = filteredAll.filter((a) => {
    const ad = parseLocalDate(a.date);
    return ad.getFullYear() === currentMonth.getFullYear() && ad.getMonth() === currentMonth.getMonth();
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, AppointmentItem[]>>((acc, a) => {
    const dateKey = a.date.split("T")[0];
    const dateTime = parseLocalDateTime(a.date);
    const timeLabel = dateTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false });
    const patient = mockPatients.find((p) => p.id === a.patientId);
    const patientName = patient ? `${patient.firstname} ${patient.lastname}` : "Paciente desconocido";

    const list = acc[dateKey] || [];
    list.push({ patientName, timeLabel, dateTime });
    acc[dateKey] = list;
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => parseLocalDate(a).getTime() - parseLocalDate(b).getTime());

  // Ensure appointments for each date are sorted by time
  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((x, y) => {
      return x.dateTime.getTime() - y.dateTime.getTime();
    });
  });

  const agenda: DayAgenda[] = dates.map((dateStr) => {
    const d = parseLocalDate(dateStr);
    return {
      dayName: d.toLocaleDateString('en-US', { weekday: "long" }),
      dayNumber: d.getDate(),
      date: dateStr,
      appointments: grouped[dateStr],
    };
  });

  return (
    <Card className="w-full bg-card rounded-[32px] shadow-lg border-none overflow-hidden p-6">
      <div className="flex items-center justify-center gap-6 mb-6">
        <button onClick={prevMonth} className="p-2 hover:bg-accent rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <h3 className="text-lg font-semibold text-primary min-w-[160px] text-center">
          {currentMonth.toLocaleString('en-US', { month: "long", year: "numeric" })}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-accent rounded-full transition-colors">
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="border border-border rounded-[12px] overflow-hidden flex divide-x divide-border min-h-[180px]">
        {(() => {
          // Distribute `agenda` filling columns vertically (top-to-bottom)
          const cols: DayAgenda[][] = [[], [], []];
          if (agenda.length > 0) {
            const rows = Math.ceil(agenda.length / 3);
            for (let i = 0; i < 3; i++) {
              const start = i * rows;
              cols[i] = agenda.slice(start, start + rows);
            }
          }

          return cols.map((col, colIdx) => (
            <div key={colIdx} className="flex-1 p-4 space-y-4">
              {col.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground">No appointments</div>
              ) : (
                col.map((day) => (
                  <div key={day.date} className="space-y-3">
                    <h4 className="text-primary font-bold text-sm">
                      {day.dayName} <span className="text-base">{day.dayNumber}</span>
                    </h4>
                    <div className="space-y-2">
                      {day.appointments.map((app, appIdx) => (
                        <div
                          key={appIdx}
                          className="bg-muted rounded-lg p-2 border-l-[4px] border-primary flex flex-col justify-center"
                        >
                          <p className="text-primary font-bold text-sm leading-tight">{app.patientName}</p>
                              <p className="text-secondary text-xs font-semibold">{app.timeLabel}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ));
        })()}
      </div>
    </Card>
  );
}
