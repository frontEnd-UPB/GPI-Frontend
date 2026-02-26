import { FiInfo, FiCheckCircle } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";

import { theme } from "../../../core/theme/index";
import { Skeleton } from "../../../ui/skeleton";
const VACATION_INDICATORS = [
  { key: "assigned", label: "Assigned Days", iconName: "info", colorToken: "info" },
  { key: "used", label: "Days Used", iconName: "cancel", colorToken: "error" },
  { key: "available", label: "Days Available", iconName: "check", colorToken: "success" },
] as const;
const ICON_MAP = {
  info: <FiInfo size={22} />,
  cancel: <MdOutlineCancel size={22} />,
  check: <FiCheckCircle size={22} />,
};

export default function VacationBalanceCard({ balance }) {
  const { colors, typography } = theme;

  return (
    <div
      className="rounded-xl border p-6 shadow-sm"
      style={{ borderColor: colors.border, backgroundColor: colors.surface }}
    >
      <h2
        className="text-lg font-semibold mb-6"
        style={{ color: colors.textPrimary, fontFamily: typography.fontFamily.semiBold }}
      >
        Vacation Balance
      </h2>

      <div className="flex flex-col gap-4">
        {VACATION_INDICATORS.map((indicator) => {
          const color = colors[indicator.colorToken];
          const value = balance?.[indicator.key];

          return (
            <div key={indicator.key} className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full"
                style={{ backgroundColor: `${color}1A`, color }}
              >
                {ICON_MAP[indicator.iconName]}
              </div>

              <div className="flex flex-col">
                <span
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {indicator.label}
                </span>
                {value !== null && value !== undefined ? (
                  <span
                    className="text-base font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {value} Days
                  </span>
                ) : (
                  <Skeleton className="w-[70px] h-[20px] mt-1" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}