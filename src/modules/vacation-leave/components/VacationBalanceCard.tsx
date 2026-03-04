import { FiInfo, FiCheckCircle } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { Skeleton } from "../../../ui/skeleton";

const VACATION_INDICATORS = [
  {
    key: "assigned",
    label: "Assigned Days",
    iconName: "info",
    colorToken: "info",
  },
  {
    key: "used",
    label: "Days Used",
    iconName: "cancel",
    colorToken: "error",
  },
  {
    key: "available",
    label: "Days Available",
    iconName: "check",
    colorToken: "success",
  },
] as const;

const ICON_MAP = {
  info: <FiInfo size={28} />,
  cancel: <MdOutlineCancel size={28} />,
  check: <FiCheckCircle size={28} />,
};

/** Maps each colorToken to Tailwind utility classes driven by theme CSS vars */
const COLOR_CLASSES = {
  info: {
    container: "bg-info/10 text-info",
    value: "text-info",
  },
  error: {
    container: "bg-destructive/10 text-destructive",
    value: "text-destructive",
  },
  success: {
    container: "bg-success/10 text-success",
    value: "text-success",
  },
} as const;

type VacationBalance = {
  assigned?: number | null;
  used?: number | null;
  available?: number | null;
};

type VacationBalanceCardProps = {
  balance?: VacationBalance;
};

export default function VacationBalanceCard({ balance }: VacationBalanceCardProps) {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full flex flex-col border border-border bg-card shadow-sm rounded-2xl py-xl px-xxxl">
        <h2 className="font-bold mb-5 text-2xl md:text-4xl text-brand">
          Vacation Balance
        </h2>

        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-xxxl">
          {VACATION_INDICATORS.map((indicator) => {
            const { container, value: valueClass } = COLOR_CLASSES[indicator.colorToken];
            const value = balance?.[indicator.key];

            return (
              <div key={indicator.key} className="flex items-center gap-lg">
                <div
                  className={`flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl ${container}`}
                >
                  {ICON_MAP[indicator.iconName]}
                </div>

                <div className="flex flex-col gap-xs">
                  <span className="text-muted-foreground text-base">
                    {indicator.label}
                  </span>
                  {value !== null && value !== undefined ? (
                    <span className={`text-xl font-bold ${valueClass}`}>
                      {value} Days
                    </span>
                  ) : (
                    <Skeleton className="w-[80px] h-[24px] mt-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}