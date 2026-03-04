import { format, parseISO } from "date-fns";
import { FiCalendar } from "react-icons/fi";

interface DateRangeDisplayProps {
  startDate: string;
  endDate: string;
}

export default function DateRangeDisplay({
  startDate,
  endDate,
}: DateRangeDisplayProps) {
  const fmt = (iso: string) => {
    try { return format(parseISO(iso), "dd/MM/yyyy"); }
    catch { return iso; }
  };

  return (
    <div className="flex flex-wrap gap-xxl bg-background rounded-full py-lg px-xxl mb-xl">
      {/* Start Date */}
      <div className="flex-1 min-w-[140px] flex items-start gap-sm">
        <FiCalendar className="text-primary mt-0.5 shrink-0" size={20} />
        <div>
          <label className="block text-xs font-semibold text-primary">
            Start Date
          </label>
          <div className="mt-1.5 text-sm text-foreground">{fmt(startDate)}</div>
        </div>
      </div>

      {/* End Date */}
      <div className="flex-1 min-w-[140px] flex items-start gap-sm">
        <FiCalendar className="text-primary mt-0.5 shrink-0" size={20} />
        <div>
          <label className="block text-xs font-semibold text-primary">
            End Date
          </label>
          <div className="mt-1.5 text-sm text-foreground">{fmt(endDate)}</div>
        </div>
      </div>
    </div>
  );
}