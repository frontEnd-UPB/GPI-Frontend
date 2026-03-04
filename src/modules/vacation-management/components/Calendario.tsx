import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../ui/button";

export type CalendarEvent = {
  id: string;
  doctorName: string;
  department: string;
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

  const COLOR_PALETTE = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
  ];

  const { days, gridStart, gridEnd } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    const gs = new Date(year, month, 1 - firstOfMonth.getDay());
    const ge = new Date(
      year,
      month,
      lastOfMonth.getDate() + (6 - lastOfMonth.getDay())
    );

    const list: Date[] = [];
    for (
      let d = startOfDay(gs);
      d <= startOfDay(ge);
      d.setDate(d.getDate() + 1)
    ) {
      list.push(new Date(d));
    }

    return {
      days: list,
      gridStart: startOfDay(gs),
      gridEnd: startOfDay(ge),
    };
  }, [currentMonth]);

  const eventsMap = useMemo(() => {
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
  }, [events]);

  const departmentColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    let index = 0;

    events.forEach((evt) => {
      if (!evt.department) return;
      if (!map[evt.department]) {
        map[evt.department] =
          COLOR_PALETTE[index % COLOR_PALETTE.length];
        index++;
      }
    });

    return map;
  }, [events]);

  const visibleDepartments = useMemo(() => {
    const set = new Set<string>();

    events.forEach((evt) => {
      const s = startOfDay(new Date(evt.startDate));
      const e = startOfDay(new Date(evt.endDate));

      if (s <= gridEnd && e >= gridStart) {
        if (evt.department) set.add(evt.department);
      }
    });

    return Array.from(set).sort();
  }, [events, gridStart, gridEnd]);

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [currentMonth]
  );

  function prevMonth() {
    setCurrentMonth(
      (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentMonth(
      (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)
    );
  }

  return (
    <div className="w-full max-w-[1500px] bg-white rounded-[19px] shadow-[0_0_20px_#00000014] p-6 mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10" onClick={prevMonth}>
            <ChevronLeft className="w-5 h-5 text-[#1F2B6C]" />
          </Button>

          <h2 className="text-[#1F2B6C] text-xl font-semibold w-[180px] text-center">
            {monthLabel}
          </h2>

          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5 text-[#1F2B6C]" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {visibleDepartments.map((name) => (
            <div key={name} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: departmentColorMap[name] || "var(--chart-1)" }}
              />
              <span className="text-xs text-[#757575] font-medium">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendario */}
      <div className="rounded-[15px] overflow-hidden border border-[#CECECE]">
        <div className="grid grid-cols-7 auto-rows-[95px]">

          {/* Header días */}
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="text-center py-3 text-[15px] font-medium text-[#757575] border-b border-r border-[#CECECE] last:border-r-0 bg-white"
            >
              {day}
            </div>
          ))}

          {/* Días */}
          {days.map((date, index) => {
            const key = formatDateKey(date);
            const isOtherMonth =
              date.getMonth() !== currentMonth.getMonth();
            const dayEvents = eventsMap[key] || [];

            const isLastColumn = (index + 1) % 7 === 0;
            const isLastRow = index >= days.length - 7;

            return (
              <div
                key={key}
                className={`
                  p-2 bg-white hover:bg-slate-50 transition-colors
                  border-r border-b border-[#CECECE]
                  ${isLastColumn ? "border-r-0" : ""}
                  ${isLastRow ? "border-b-0" : ""}
                `}
              >
                <span
                  className={`text-[13px] font-medium ${
                    isOtherMonth ? "text-[#CECECE]" : "text-[#757575]"
                  }`}
                >
                  {date.getDate()}
                </span>

                {/* Mostrar máximo 2 eventos */}
                {dayEvents.length > 0 && (
                  <div className="mt-1 flex flex-col gap-1">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className="text-white text-[11px] px-2 py-0.5 rounded-[5px] font-medium truncate"
                        style={{
                          backgroundColor:
                            departmentColorMap[evt.department] ||
                            "var(--chart-1)",
                        }}
                      >
                        {evt.doctorName}
                      </div>
                    ))}

                    {/* Si hay más de 2 */}
                    {dayEvents.length > 2 && (
                      <span className="text-[11px] text-[#757575] font-medium">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
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