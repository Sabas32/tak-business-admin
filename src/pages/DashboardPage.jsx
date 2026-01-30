import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, CreditCard, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  CHART_DATA,
  RECENT_ACTIVITY,
  SYSTEM_ALERTS,
  TOP_BUSINESSES,
} from "../data/mockData";
import StatCard from "../components/StatCard";
import { getChartTheme } from "../utils/chartTheme";

const DashboardPage = () => {
  const { users, businesses, transactions, isDark, refundRequests } =
    useAppContext();
  const navigate = useNavigate();

  const theme = getChartTheme(isDark);

  const totalRevenue = transactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const activeSubscriptions = businesses.filter(
    (b) => b.status === "Active"
  ).length;
  const totalRefunds = transactions
    .filter((t) => t.status === "Refunded")
    .reduce((sum, t) => sum + t.amount, 0);
  const refundRate =
    transactions.length > 0
      ? Math.round(
          (transactions.filter((t) => t.status === "Refunded").length /
            transactions.length) *
            100
        )
      : 0;
  const lowStockTotal = businesses.reduce((sum, b) => sum + b.lowStock, 0);
  const syncDelayed = businesses.filter(
    (b) => b.syncStatus !== "Healthy"
  ).length;
  const pendingRefunds = refundRequests.filter(
    (request) => request.status === "Pending"
  );
  const pendingRefundTotal = pendingRefunds.reduce(
    (sum, request) => sum + request.amount,
    0
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend={12}
        />
        <StatCard
          title="Active Users"
          value={users.filter((u) => u.status === "Active").length}
          icon={Users}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend={8}
        />
        <StatCard
          title="Businesses"
          value={businesses.length}
          icon={Building2}
          color="bg-gradient-to-br from-amber-500 to-orange-600"
          trend={15}
        />
        <StatCard
          title="Active Subscriptions"
          value={activeSubscriptions}
          icon={CreditCard}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          trend={10}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Revenue"
          value={`UGX ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-red-500"
          trend={22}
        />
        <StatCard
          title="Refunds"
          value={`UGX ${totalRefunds.toLocaleString()}`}
          icon={DollarSign}
          color="bg-gradient-to-br from-gray-500 to-gray-600"
          trend={-5}
        />
        <StatCard
          title="Refund Rate"
          value={`${refundRate}%`}
          icon={DollarSign}
          color="bg-gradient-to-br from-teal-500 to-teal-600"
          trend={18}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            User Growth
          </h2>
          <ResponsiveContainer
            width="100%"
            height={250}
            className="sm:h-[300px]"
          >
            <LineChart data={CHART_DATA}>
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
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ r: 3, fill: "#EF4444", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive={theme.animate}
                animationDuration={theme.animationDuration}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Revenue & Subscriptions
          </h2>
          <ResponsiveContainer
            width="100%"
            height={250}
            className="sm:h-[300px]"
          >
            <BarChart data={CHART_DATA}>
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
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="revenue"
                fill="#EF4444"
                radius={[10, 10, 0, 0]}
                barSize={18}
                isAnimationActive={theme.animate}
                animationDuration={theme.animationDuration}
              />
              <Bar
                dataKey="subscriptions"
                fill="#EC4899"
                radius={[10, 10, 0, 0]}
                barSize={18}
                isAnimationActive={theme.animate}
                animationDuration={theme.animationDuration}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Operational Alerts
          </h2>
          <div className="space-y-3">
            {SYSTEM_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {alert.detail}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    alert.severity === "critical"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : alert.severity === "warning"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Low Stock Alerts
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {lowStockTotal}
              </p>
            </div>
            <div className="p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sync Delays
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {syncDelayed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.detail}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Refund Requests
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {pendingRefunds.length} pending . UGX{" "}
                {pendingRefundTotal.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => navigate("/refunds")}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
            >
              View
            </button>
          </div>
          <div className="space-y-3 mt-4">
            {pendingRefunds.slice(0, 3).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {request.business}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {request.reason}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  UGX {request.amount.toLocaleString()}
                </p>
              </div>
            ))}
            {pendingRefunds.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                No pending refund requests.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Top Businesses
          </h2>
          <div className="space-y-3">
            {TOP_BUSINESSES.map((biz) => (
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
    </div>
  );
};

export default DashboardPage;

