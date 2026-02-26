export const theme = {
  colors: {
    // Brand
    primary: "#1E88E5",
    primaryLight: "#E3F2FD",
    primaryDark: "#1F2B6C",

    secondary: "#2E7D32",
    secondaryLight: "#E8F5E9",
    secondaryDark: "#1B5E20",

    // Status
    success: "#4CAF50",
    warning: "#F9A825",
    error: "#E53935",
    info: "#29B6F6",

    // Backgrounds
    background: "#F5F7FA",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    border: "#E5E7EB",

    // Text
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    textDisabled: "#9CA3AF",
    textOnPrimary: "#FFFFFF",
  },

  typography: {
    fontFamily: {
      regular: "Inter-Regular",
      medium: "Inter-Medium",
      semiBold: "Inter-SemiBold",
      bold: "Inter-Bold",
    },

    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      display: 32,
    },

    lineHeight: {
      sm: 18,
      md: 22,
      lg: 26,
      xl: 30,
      xxl: 34,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 999,
  },

  layout: {
    containerPadding: 20,
    sectionSpacing: 24,
    sidebarWidth: 260,
    headerHeight: 72,
  },
};

export type Theme = typeof theme;
