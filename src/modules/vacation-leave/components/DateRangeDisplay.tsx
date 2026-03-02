import { theme } from "../../../core/theme";
import { FiCalendar } from "react-icons/fi";

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
      <div style={{ 
        flex: 1, 
        minWidth: 140,
        display: "flex",
        alignItems: "flex-start",
        gap: spacing.sm
      }}>
        <FiCalendar color={colors.primaryDark} size={20} style={{ marginTop: 2 }} />
        <div>
          <label
            style={{
              fontSize: typography.fontSize.xs,
              fontFamily: typography.fontFamily.semiBold,
              color: colors.primaryDark,
              display: "block",
            }}
          >
            Start Date
          </label>
          <div style={{ marginTop: 6 }}>{startDate}</div>
        </div>
      </div>

      {/* End Date */}
      <div style={{ 
        flex: 1, 
        minWidth: 140,
        display: "flex",
        alignItems: "flex-start",
        gap: spacing.sm
      }}>
        <FiCalendar color={colors.primaryDark} size={20} style={{ marginTop: 2 }} />
        <div>
          <label
            style={{
              fontSize: typography.fontSize.xs,
              fontFamily: typography.fontFamily.semiBold,
              color: colors.primaryDark,
              display: "block",
            }}
          >
            End Date
          </label>
          <div style={{ marginTop: 6 }}>{endDate}</div>
        </div>
      </div>
    </div>
  );
}