import { Skeleton } from "../../../../ui/skeleton";
import type { VacationBalance } from "../../../../core/constants";

const VACATION_INDICATORS = [
  {
    key: "assigned",
    label: "Assigned",
    iconName: "info",
    colorToken: "primary",
  },
  {
    key: "used",
    label: "Used",
    iconName: "cancel",
    colorToken: "destructive",
  },
  {
    key: "available",
    label: "Available",
    iconName: "check",
    colorToken: "success",
  },
] as const;

const ICON_MAP = {
  info: (
    <span className="material-symbols-rounded text-[26px] leading-none">
      info
    </span>
  ),
  cancel: (
    <span className="material-symbols-rounded text-[26px] leading-none">
      cancel
    </span>
  ),
  check: (
    <span className="material-symbols-rounded text-[26px] leading-none">
      check_circle
    </span>
  ),
};

const COLOR_CLASSES = {
  primary: {
    container: "bg-secondary-foreground text-secondary",
    value: "text-primary",
  },
  destructive: {
    container: "bg-destructive-foreground text-destructive",
    value: "text-destructive",
  },
  success: {
    container: "bg-status-approved-foreground text-success",
    value: "text-success",
  },
} as const;

type VacationBalanceCardProps = {
  balance?: VacationBalance | null;
};

export default function VacationBalanceCard({ balance }: VacationBalanceCardProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl bg-card border border-border rounded-4xl shadow-sm px-10 py-8 flex flex-col gap-4">

        <h2 className="text-3xl font-bold text-secondary tracking-tight">
          Vacation Balance
        </h2>

        <div className="flex items-center justify-center gap-20 md:gap-28 flex-wrap">

          {VACATION_INDICATORS.map((indicator) => {
            const { container, value } = COLOR_CLASSES[indicator.colorToken];
            const val = balance?.[indicator.key];

            return (
              <div
                key={indicator.key}
                className="flex items-center gap-5"
              >
                <div
                  className={`flex h-[53px] w-[53px] items-center justify-center rounded-2xl ${container}`}
                >
                  {ICON_MAP[indicator.iconName]}
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="text-sm text-muted-foreground">
                    {indicator.label}
                  </span>

                  {val !== null && val !== undefined ? (
                    <span className={`text-xl font-semibold ${value}`}>
                      {val}{" "}
                      <span className="font-normal">
                        Days
                      </span>
                    </span>
                  ) : (
                    <Skeleton className="h-[22px] w-[70px] mt-1" />
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