export const getChartTheme = (isDark) => ({
  gridColor: isDark ? "#374151" : "#E5E7EB",
  gridOpacity: 0.6,
  gridDash: "4 4",
  axisColor: isDark ? "#9CA3AF" : "#6B7280",
  tooltipText: isDark ? "#F9FAFB" : "#111827",
  tooltipStyle: {
    backgroundColor: isDark ? "#111827" : "#FFFFFF",
    border: `1px solid ${isDark ? "#1F2937" : "#E5E7EB"}`,
    borderRadius: "12px",
    color: isDark ? "#F9FAFB" : "#111827",
  },
  pieStroke: isDark ? "#111827" : "#FFFFFF",
  animate: true,
  animationDuration: 800,
});
