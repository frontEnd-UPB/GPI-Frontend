import { theme } from "../../../core/theme";

interface DateRangeDisplayProps {
  startDate: string;
  endDate: string;
}

export default function DateRangeDisplay({
  startDate,
  endDate,
}: DateRangeDisplayProps) {
  const { colors, typography, radius, spacing } = theme;

  return (
    <div
      style={{
        display: "flex",
        gap: spacing.xxl,
        backgroundColor: colors.background,
        borderRadius: radius.full,
        padding: `${spacing.lg}px ${spacing.xxl}px`,
        marginBottom: spacing.xl,
        flexWrap: "wrap",
      }}
    >
      {/* Start Date */}
      <div style={{ flex: 1, minWidth: 140 }}>
        <label
          style={{
            fontSize: typography.fontSize.xs,
            fontFamily: typography.fontFamily.semiBold,
            color: colors.primaryDark,
          }}
        >
          Start Date
        </label>

        <div style={{ 
            marginTop: 6,
            //color: colors.primaryDark,
            //fontFamily: typography.fontFamily.semiBold,
             }}>{startDate}</div>
      </div>

      {/* End Date */}
      <div style={{ flex: 1, minWidth: 140 }}>
        <label
          style={{
            fontSize: typography.fontSize.xs,
            fontFamily: typography.fontFamily.semiBold,
            color: colors.primaryDark,
          }}
        >
          End Date
        </label>

        <div style={{ marginTop: 6 }}>{endDate}</div>
      </div>
    </div>
  );
}