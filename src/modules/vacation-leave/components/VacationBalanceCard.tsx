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
  info: <FiInfo size={28} />,
  cancel: <MdOutlineCancel size={28} />,
  check: <FiCheckCircle size={28} />,
};

type VacationBalance = {
  assigned?: number | null;
  used?: number | null;
  available?: number | null;
};

type VacationBalanceCardProps = {
  balance?: VacationBalance;
};

export default function VacationBalanceCard({ balance }: VacationBalanceCardProps) {
  const { colors, typography, radius, spacing } = theme;

  return (
    <div className="flex justify-center w-full">
    <div
      className="inline-flex flex-col border shadow-sm"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: `${spacing.xl}px ${spacing.xxxl}px`,
      }}
    >
      <h2
        className="font-bold mb-5"
        style={{
          color: colors.primary,
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.fontSize.display,
        }}
      >
        Vacation Balance
      </h2>

      <div
        className="flex flex-col md:flex-row md:flex-wrap items-center"
        style={{ gap: spacing.xxxl }}
      >
        {VACATION_INDICATORS.map((indicator) => {
          const color = colors[indicator.colorToken];
          const value = balance?.[indicator.key];

          return (
            <div
              key={indicator.key}
              className="flex items-center"
              style={{ gap: spacing.lg }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.lg,
                  backgroundColor: `${color}1A`,
                  color,
                  flexShrink: 0,
                }}
              >
                {ICON_MAP[indicator.iconName]}
              </div>

              <div className="flex flex-col" style={{ gap: 3 }}>
                <span
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.fontSize.md,
                    fontFamily: typography.fontFamily.regular,
                  }}
                >
                  {indicator.label}
                </span>
                {value !== null && value !== undefined ? (
                  <span
                    style={{
                      color,
                      fontSize: typography.fontSize.xl,
                      fontFamily: typography.fontFamily.bold,
                    }}
                  >
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