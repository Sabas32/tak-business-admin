import { useMemo, useState } from "react";
import { Bell, BellDot, CheckCircle2, Layers, XCircle } from "lucide-react";
import { NOTIFICATION_RULES, NOTIFICATIONS_LOG } from "../data/mockData";
import Select from "../components/Select";

const NotificationsPage = () => {
  const [rules, setRules] = useState(NOTIFICATION_RULES);
  const [logs] = useState(NOTIFICATIONS_LOG);
  const [ruleStatusFilter, setRuleStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [logStatusFilter, setLogStatusFilter] = useState("all");

  const channelOptions = useMemo(() => {
    const channels = new Set([
      ...rules.map((rule) => rule.channel),
      ...logs.map((entry) => entry.channel),
    ]);
    return [
      { value: "all", label: "All Channels" },
      ...Array.from(channels).map((channel) => ({
        value: channel,
        label: channel,
      })),
    ];
  }, []);

  const filteredRules = rules.filter((rule) => {
    const matchesStatus =
      ruleStatusFilter === "all" || rule.status === ruleStatusFilter;
    const matchesChannel =
      channelFilter === "all" || rule.channel === channelFilter;
    return matchesStatus && matchesChannel;
  });

  const filteredLogs = logs.filter((entry) => {
    const matchesStatus =
      logStatusFilter === "all" || entry.status === logStatusFilter;
    const matchesChannel =
      channelFilter === "all" || entry.channel === channelFilter;
    return matchesStatus && matchesChannel;
  });

  const activeRules = rules.filter(
    (rule) => rule.status === "Active"
  ).length;
  const sentCount = logs.filter(
    (entry) => entry.status === "Sent"
  ).length;
  const failedCount = logs.filter(
    (entry) => entry.status === "Failed"
  ).length;
  const channelCount = channelOptions.filter(
    (option) => option.value !== "all"
  ).length;
  const totalLogs = logs.length;
  const deliveryRate = totalLogs
    ? Math.round((sentCount / totalLogs) * 100)
    : 0;

  const channelSummary = useMemo(
    () =>
      channelOptions
        .filter((option) => option.value !== "all")
        .map((option) => ({
          channel: option.value,
          rules: rules.filter(
            (rule) => rule.channel === option.value
          ).length,
          sent: logs.filter(
            (entry) =>
              entry.channel === option.value && entry.status === "Sent"
          ).length,
          failed: logs.filter(
            (entry) =>
              entry.channel === option.value && entry.status === "Failed"
          ).length,
        })),
    [channelOptions, logs, rules]
  );

  const channelHealth = useMemo(
    () =>
      channelSummary.map((item) => {
        const total = item.sent + item.failed;
        const successRate = total ? Math.round((item.sent / total) * 100) : 0;
        return { ...item, total, successRate };
      }),
    [channelSummary]
  );

  const toggleRuleStatus = (id) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              status: rule.status === "Active" ? "Disabled" : "Active",
            }
          : rule
      )
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Manage alert rules and review notification history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="tak-card rounded-2xl p-4 sm:p-5 border border-[color:var(--tak-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[color:var(--tak-muted)]">
                Active Rules
              </p>
              <p className="text-2xl font-bold text-[color:var(--tak-text)]">
                {activeRules}
              </p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-[color:var(--tak-accent-soft)] text-[color:var(--tak-accent)] flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="tak-card rounded-2xl p-4 sm:p-5 border border-[color:var(--tak-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[color:var(--tak-muted)]">
                Notifications Sent
              </p>
              <p className="text-2xl font-bold text-[color:var(--tak-text)]">
                {sentCount}
              </p>
              <p className="text-xs text-[color:var(--tak-muted)]">
                Delivery rate: {deliveryRate}%
              </p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-[color:var(--tak-success-soft)] text-[color:var(--tak-success)] flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="tak-card rounded-2xl p-4 sm:p-5 border border-[color:var(--tak-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[color:var(--tak-muted)]">
                Failed Deliveries
              </p>
              <p className="text-2xl font-bold text-[color:var(--tak-text)]">
                {failedCount}
              </p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-[color:var(--tak-accent-soft)] text-[color:var(--tak-accent)] flex items-center justify-center">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="tak-card rounded-2xl p-4 sm:p-5 border border-[color:var(--tak-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[color:var(--tak-muted)]">
                Active Channels
              </p>
              <p className="text-2xl font-bold text-[color:var(--tak-text)]">
                {channelCount}
              </p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-[color:var(--tak-bg-soft)] text-[color:var(--tak-text-gray)] flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="tak-card rounded-2xl p-4 sm:p-6 border border-[color:var(--tak-border)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[color:var(--tak-accent-soft)] text-[color:var(--tak-accent)] flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[color:var(--tak-text)]">
                Notification Rules
              </h2>
              <p className="text-xs text-[color:var(--tak-muted)]">
                Set triggers and delivery channels
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={ruleStatusFilter}
              onChange={setRuleStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "Active", label: "Active" },
                { value: "Disabled", label: "Disabled" },
              ]}
              className="w-36"
            />
            <Select
              value={channelFilter}
              onChange={setChannelFilter}
              options={channelOptions}
              className="w-40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="tak-table w-full min-w-[720px]">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left">Rule</th>
                <th className="px-6 py-4 text-left">Trigger</th>
                <th className="px-6 py-4 text-left">Channel</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredRules.map((rule) => (
                <tr key={rule.id}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[color:var(--tak-text)]">
                      {rule.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[color:var(--tak-text-gray)]">
                    {rule.trigger}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full border border-[color:var(--tak-border-strong)] text-[color:var(--tak-text-gray)]">
                      {rule.channel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        rule.status === "Active"
                          ? "bg-[color:var(--tak-success-soft)] text-[color:var(--tak-success)]"
                          : "bg-[color:var(--tak-bg-soft)] text-[color:var(--tak-muted)]"
                      }`}
                    >
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRuleStatus(rule.id)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                        rule.status === "Active"
                          ? "border-[color:var(--tak-accent)] text-[color:var(--tak-accent)] hover:bg-[color:var(--tak-accent-soft)]"
                          : "border-[color:var(--tak-success)] text-[color:var(--tak-success)] hover:bg-[color:var(--tak-success-soft)]"
                      }`}
                    >
                      {rule.status === "Active" ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRules.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-6 text-sm text-[color:var(--tak-muted)] text-center"
                    colSpan={5}
                  >
                    No rules match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 tak-card rounded-2xl p-4 sm:p-6 border border-[color:var(--tak-border)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <BellDot className="w-5 h-5 text-[color:var(--tak-accent)]" />
              <h2 className="text-lg font-bold text-[color:var(--tak-text)]">
                Notification Log
              </h2>
            </div>
            <Select
              value={logStatusFilter}
              onChange={setLogStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "Sent", label: "Sent" },
                { value: "Failed", label: "Failed" },
              ]}
              className="w-32"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="tak-table w-full min-w-[720px]">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left">Notification</th>
                  <th className="px-6 py-4 text-left">Target</th>
                  <th className="px-6 py-4 text-left">Channel</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredLogs.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 text-sm font-semibold text-[color:var(--tak-text)]">
                      {entry.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-[color:var(--tak-text-gray)]">
                      {entry.target}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full border border-[color:var(--tak-border-strong)] text-[color:var(--tak-text-gray)]">
                        {entry.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          entry.status === "Sent"
                            ? "bg-[color:var(--tak-success-soft)] text-[color:var(--tak-success)]"
                            : "bg-[color:var(--tak-accent-soft)] text-[color:var(--tak-accent)]"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[color:var(--tak-muted)]">
                      {entry.time}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-6 text-sm text-[color:var(--tak-muted)] text-center"
                      colSpan={5}
                    >
                      No log entries found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="tak-card rounded-2xl p-4 sm:p-6 border border-[color:var(--tak-border)]">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-[color:var(--tak-success)]" />
            <h3 className="text-lg font-bold text-[color:var(--tak-text)]">
              Channel Health
            </h3>
          </div>
          <div className="space-y-4">
            {channelHealth.map((item) => (
              <div
                key={item.channel}
                className="rounded-2xl border border-[color:var(--tak-border-strong)] p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[color:var(--tak-text)]">
                    {item.channel}
                  </p>
                  <span className="text-xs text-[color:var(--tak-muted)]">
                    {item.rules} rules
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[color:var(--tak-bg-soft)]">
                  <div
                    className="h-2 rounded-full bg-[color:var(--tak-success)]"
                    style={{ width: `${item.successRate}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--tak-muted)]">
                  <span>Sent: {item.sent}</span>
                  <span>Failed: {item.failed}</span>
                  <span>{item.successRate}% delivered</span>
                </div>
              </div>
            ))}
            {channelHealth.length === 0 && (
              <div className="text-sm text-[color:var(--tak-muted)] py-4 text-center">
                No channel data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;


