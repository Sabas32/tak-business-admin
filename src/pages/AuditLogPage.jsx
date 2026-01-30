import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { AUDIT_LOGS } from "../data/mockData";
import Select from "../components/Select";

const AuditLogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLogs = AUDIT_LOGS.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Audit Log
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Track admin actions across users, businesses, and billing
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="tak-search flex-1">
              <Search className="w-5 h-5 tak-search-icon" />
              <input
                type="text"
                placeholder="Search by actor, action, or target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="tak-search-input"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "Success", label: "Success" },
                  { value: "Failed", label: "Failed" },
                ]}
                className="w-40"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="tak-table w-full min-w-[640px]">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Actor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Action
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Target
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                  {log.actor}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {log.action}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {log.target}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {log.time}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      log.status === "Success"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogPage;





