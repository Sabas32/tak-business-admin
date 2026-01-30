import { useState } from "react";
import { AlertTriangle, ShieldAlert, WifiOff } from "lucide-react";
import {
  APP_INTEGRITY_EVENTS,
  AUTH_EVENTS,
  SYNC_ISSUES,
} from "../data/mockData";

const SystemHealthPage = () => {
  const [showResolved, setShowResolved] = useState(true);

  const unresolvedAuth = showResolved
    ? AUTH_EVENTS
    : AUTH_EVENTS.filter((e) => e.status !== "Completed");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          System Health
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Monitor sync failures, integrity issues, and auth events
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Sync Issues
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {SYNC_ISSUES.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Integrity Alerts
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {APP_INTEGRITY_EVENTS.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Auth Events
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {AUTH_EVENTS.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Sync Failures
            </h2>
            <WifiOff className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {SYNC_ISSUES.map((issue) => (
              <div
                key={issue.id}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {issue.business}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      issue.status === "Offline"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Last Sync: {issue.lastSync}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {issue.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              App Integrity Events
            </h2>
            <ShieldAlert className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {APP_INTEGRITY_EVENTS.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {event.event}
                  </p>
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    {event.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {event.business} . {event.device}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {event.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Authentication Events
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              OTP failures, resets, and 2FA activity
            </p>
          </div>
          <button
            onClick={() => setShowResolved((prev) => !prev)}
            className="px-3 py-1 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            {showResolved ? "Hide Completed" : "Show Completed"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {unresolvedAuth.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {event.user}
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    event.status === "Completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {event.event}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {event.time}
              </p>
            </div>
          ))}
        </div>
        {unresolvedAuth.length === 0 && (
          <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            No active authentication events
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthPage;

