import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../ui/button";
import { specialties } from "../constants/specialties";

export type CalendarEvent = {
  id: string;
  doctorName: string;
  specialty: string;
  startDate: string;
  endDate: string;
};

type CalendarioProps = {
  events: CalendarEvent[];
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Calendario({ events }: CalendarioProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const specialtyColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    specialties.forEach((s) => (map[s.name] = s.color));
    return map;
  }, []);

  // Build calendar grid (start on Sunday - 0) covering the full weeks that include
  // the current month (may include days from previous/next month to fill weeks).
  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());
    const gridEnd = new Date(year, month, lastOfMonth.getDate() + (6 - lastOfMonth.getDay()));

    const list: Date[] = [];
    for (let d = startOfDay(gridStart); d <= startOfDay(gridEnd); d.setDate(d.getDate() + 1)) {
      list.push(new Date(d));
    }
    return list;
  }, [currentMonth]);

  // Index events by date key for quick lookup (an event spanning multiple days will
  // be added to each date in its range).
  const eventsByDate = (events: CalendarEvent[]) => {
    const map: Record<string, CalendarEvent[]> = {};

    events.forEach((evt) => {
      const start = startOfDay(new Date(evt.startDate));
      const end = startOfDay(new Date(evt.endDate));
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = formatDateKey(d);
        if (!map[key]) map[key] = [];
        map[key].push(evt);
      }
    });

    return map;
  };

  const eventsMap = useMemo(() => eventsByDate(events), [events]);

  const monthLabel = useMemo(() => currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" }), [currentMonth]);

  function prevMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  return (
    <div className="w-[1212px] h-[684px] bg-white rounded-[19px] shadow-[0_0_20px_#00000014] p-8 flex flex-col items-center">
      <div className="w-full h-[88px] flex items-center gap-[54px] shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 flex items-center justify-center" onClick={prevMonth}>
            <ChevronLeft className="w-5 h-5 text-[#1F2B6C]" />
          </Button>
          <h2 className="text-[#1F2B6C] text-center w-[175px] text-xl font-semibold leading-none">
            {monthLabel}
          </h2>
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 flex items-center justify-center" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5 text-[#1F2B6C]" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {specialties.map((spec) => (
            <div key={spec.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: spec.color }} />
              <span className="text-[#757575] text-xs font-medium">{spec.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[1163px] h-[560px] border border-[#CECECE] rounded-[15px] overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 border-b border-[#CECECE] h-[51px] items-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-[#757575] text-center text-[15px] font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1">
          {days.map((date) => {
            const key = formatDateKey(date);
            const dayNumber = date.getDate();
            const isOtherMonth = date.getMonth() !== currentMonth.getMonth();
            const events = eventsMap[key] || [];

            return (
              <div key={key} className="border-r border-b border-[#CECECE] p-2 relative group hover:bg-slate-50 transition-colors">
                <span className={`text-[15px] font-medium ${isOtherMonth ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                  {dayNumber}
                </span>

                {events.length > 0 && (
                  <div className="mt-1 flex flex-col gap-1">
                    {events.map((evt) => (
                      <div
                        key={evt.id}
                        className="text-white text-[11px] px-2 py-0.5 rounded-[5px] font-medium truncate"
                        style={{ backgroundColor: specialtyColorMap[evt.specialty] || '#999999' }}
                        title={`${evt.doctorName} — ${evt.specialty}`}
                      >
                        {evt.doctorName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
