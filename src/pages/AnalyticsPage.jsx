import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppContext } from "../context/AppContext";
import { PROFIT_SUMMARY } from "../data/mockData";
import { getChartTheme } from "../utils/chartTheme";

const AnalyticsPage = () => {
  const { users, businesses, transactions, isDark } = useAppContext();

  const theme = getChartTheme(isDark);

  const retentionData = [
    { month: "Jan", retention: 85 },
    { month: "Feb", retention: 82 },
    { month: "Mar", retention: 88 },
    { month: "Apr", retention: 90 },
    { month: "May", retention: 87 },
    { month: "Jun", retention: 92 },
  ];

  const churnData = [
    {
      name: "Active",
      value: businesses.filter((b) => b.status === "Active").length,
      color: "#10B981",
    },
    {
      name: "Suspended",
      value: businesses.filter((b) => b.status === "Suspended").length,
      color: "#EF4444",
    },
  ];

  const planMix = [
    {
      name: "Basic",
      value: businesses.filter((b) => b.plan === "Basic").length,
      color: "#3B82F6",
    },
    {
      name: "Premium",
      value: businesses.filter((b) => b.plan === "Premium").length,
      color: "#8B5CF6",
    },
    {
      name: "Enterprise",
      value: businesses.filter((b) => b.plan === "Enterprise").length,
      color: "#EF4444",
    },
  ];

  const topBusinesses = [...businesses]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const totalRevenue = PROFIT_SUMMARY.reduce(
    (sum, entry) => sum + entry.revenue,
    0
  );
  const totalExpenses = PROFIT_SUMMARY.reduce(
    (sum, entry) => sum + entry.expenses,
    0
  );
  const totalCogs = PROFIT_SUMMARY.reduce(
    (sum, entry) => sum + entry.cogs,
    0
  );
  const netProfit = PROFIT_SUMMARY.reduce(
    (sum, entry) => sum + entry.netProfit,
    0
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Detailed insights and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            User Retention Rate
          </h2>
          <ResponsiveContainer
            width="100%"
            height={250}
            className="sm:h-[300px]"
          >
            <LineChart data={retentionData}>
              <CartesianGrid
                strokeDasharray={theme.gridDash}
                stroke={theme.gridColor}
                opacity={theme.gridOpacity}
              />
              <XAxis
                dataKey="month"
                stroke={theme.axisColor}
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke={theme.axisColor} style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={theme.tooltipStyle}
                labelStyle={{ color: theme.axisColor }}
                itemStyle={{ color: theme.tooltipText }}
              />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 3, fill: "#10B981", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive={theme.animate}
                animationDuration={theme.animationDuration}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Business Status Distribution
          </h2>
          <ResponsiveContainer
            width="100%"
            height={250}
            className="sm:h-[300px]"
          >
            <PieChart>
              <Pie
                data={churnData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                paddingAngle={3}
                fill="#8884d8"
                dataKey="value"
              >
                {churnData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={theme.pieStroke}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={theme.tooltipStyle}
                itemStyle={{ color: theme.tooltipText }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Plan Mix
          </h2>
          <ResponsiveContainer
            width="100%"
            height={250}
            className="sm:h-[300px]"
          >
            <PieChart>
              <Pie
                data={planMix}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {planMix.map((entry, index) => (
                  <Cell
                    key={`plan-cell-${index}`}
                    fill={entry.color}
                    stroke={theme.pieStroke}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={theme.tooltipStyle}
                itemStyle={{ color: theme.tooltipText }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Top Businesses by Revenue
          </h2>
          <div className="space-y-3">
            {topBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {biz.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {biz.plan} plan
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  UGX {biz.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Avg Revenue per Business
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            UGX{" "}
            {Math.round(
              businesses.reduce((sum, b) => sum + b.revenue, 0) /
                businesses.length
            ).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Transactions
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {transactions.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Active Users Rate
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.round(
              (users.filter((u) => u.status === "Active").length /
                users.length) *
                100
            )}
            %
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profit & Expense Summary
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Review gross margin, expenses, and net profit trends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              UGX {totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total Expenses
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              UGX {totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Cost of Goods
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              UGX {totalCogs.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Net Profit
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              UGX {netProfit.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Profit Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={PROFIT_SUMMARY}>
              <CartesianGrid
                strokeDasharray={theme.gridDash}
                stroke={theme.gridColor}
                opacity={theme.gridOpacity}
              />
              <XAxis
                dataKey="month"
                stroke={theme.axisColor}
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke={theme.axisColor} style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={theme.tooltipStyle}
                itemStyle={{ color: theme.tooltipText }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0BAA60"
                strokeWidth={3}
                dot={{ r: 3, fill: "#0BAA60", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive={theme.animate}
                animationDuration={theme.animationDuration}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#F97316"
                strokeWidth={3}
                dot={{ r: 3, fill: "#F97316", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive={theme.animate}
                animationDuration={theme.animationDuration}
              />
              <Line
                type="monotone"
                dataKey="netProfit"
                stroke="#CD192F"
                strokeWidth={3}
                dot={{ r: 3, fill: "#CD192F", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive={theme.animate}
                animationDuration={theme.animationDuration}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="tak-table w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Expenses
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  COGS
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Net Profit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {PROFIT_SUMMARY.map((entry) => (
                <tr
                  key={entry.month}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                    {entry.month}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    UGX {entry.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    UGX {entry.expenses.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    UGX {entry.cogs.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                    UGX {entry.netProfit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

