import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { SUPPORT_QUEUE } from "../data/mockData";
import Select from "../components/Select";

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredQueue = SUPPORT_QUEUE.filter((item) => {
    const matchesSearch =
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Support Queue
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Track support requests and account actions
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="tak-search flex-1">
              <Search className="w-5 h-5 tak-search-icon" />
              <input
                type="text"
                placeholder="Search support queue..."
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
                  { value: "Pending", label: "Pending" },
                  { value: "Resolved", label: "Resolved" },
                ]}
                className="w-36"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="tak-table w-full min-w-[680px]">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Business
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredQueue.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                  {item.type}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {item.user}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {item.business}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Resolved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {item.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportPage;





