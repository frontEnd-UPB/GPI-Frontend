import React, { useState } from "react";
import { Card } from "../../../ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockAppointments } from "../../../core/mocks/data";

interface AppointmentItem {
  patientName: string;
  time: string;
}

interface DayAgenda {
  dayName: string;
  dayNumber: number;
  date: string;
  appointments: AppointmentItem[];
}

export function AppointmentsCalendar({ doctorId }: { doctorId?: string }) {
  // current month state (start at first appointment month if available, otherwise today)
  const filteredAll = doctorId ? mockAppointments.filter((a) => a.doctorId === doctorId) : mockAppointments;

  const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map((v) => Number(v));
    return new Date(y, m - 1, d);
  };

  const parseLocalDateTime = (dateStr: string, timeStr: string) => {
    const [y, m, d] = dateStr.split("-").map((v) => Number(v));
    const [hh, mm] = timeStr.split(":").map((v) => Number(v));
    return new Date(y, m - 1, d, hh, mm);
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
    const list = acc[a.date] || [];
    const time = (() => {
      try {
        const d = parseLocalDateTime(a.date, a.time);
        return d.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
      } catch (e) {
        return a.time;
      }
    })();
    list.push({ patientName: a.patientName, time });
    acc[a.date] = list;
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => parseLocalDate(a).getTime() - parseLocalDate(b).getTime());

  // Ensure appointments for each date are sorted by time
  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((x, y) => {
      const tx = parseLocalDateTime(date, x.time).getTime();
      const ty = parseLocalDateTime(date, y.time).getTime();
      return tx - ty;
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
                          <p className="text-secondary text-xs font-semibold">{app.time}</p>
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
