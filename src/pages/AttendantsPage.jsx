import { useMemo, useState } from "react";
import { Filter, Search, UserCheck } from "lucide-react";
import { MOCK_ATTENDANTS, MOCK_BUSINESSES } from "../data/mockData";
import Modal from "../components/Modal";
import Select from "../components/Select";

const AttendantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showInsights, setShowInsights] = useState(false);

  const businessMap = useMemo(
    () =>
      MOCK_BUSINESSES.reduce((acc, business) => {
        acc[business.id] = business.name;
        return acc;
      }, {}),
    []
  );

  const filteredAttendants = MOCK_ATTENDANTS.filter((attendant) => {
    const businessName = businessMap[attendant.businessId] ?? "Unassigned";
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      attendant.name.toLowerCase().includes(searchValue) ||
      attendant.role.toLowerCase().includes(searchValue) ||
      businessName.toLowerCase().includes(searchValue);
    const matchesStatus =
      statusFilter === "all" || attendant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = MOCK_ATTENDANTS.filter(
    (attendant) => attendant.status === "Active"
  ).length;
  const suspendedCount = MOCK_ATTENDANTS.filter(
    (attendant) => attendant.status === "Suspended"
  ).length;
  const uniqueBusinesses = new Set(
    MOCK_ATTENDANTS.map((attendant) => attendant.businessId)
  ).size;

  const recentActivity = useMemo(
    () =>
      [...MOCK_ATTENDANTS]
        .sort((a, b) => b.lastActive.localeCompare(a.lastActive))
        .slice(0, 3),
    []
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Attendants
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Track staff performance, roles, and business coverage
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Total Attendants
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {MOCK_ATTENDANTS.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Suspended</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {suspendedCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Businesses Covered
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {uniqueBusinesses}
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="tak-search flex-1">
                <Search className="w-5 h-5 tak-search-icon" />
                <input
                  type="text"
                  placeholder="Search attendants, roles, businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="tak-search-input"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-[180px]">
                  <label className="sr-only">Status</label>
                  <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "Active", label: "Active" },
                      { value: "Suspended", label: "Suspended" },
                    ]}
                    className="w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowInsights(true)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-gray-300/70 dark:hover:border-white/20 transition"
                >
                  <UserCheck className="w-4 h-4" />
                  View Activity
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="tak-table w-full min-w-[680px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Attendant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Business
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredAttendants.map((attendant) => (
                <tr
                  key={attendant.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                    {attendant.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {attendant.role}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {businessMap[attendant.businessId] ?? "Unassigned"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        attendant.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {attendant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {attendant.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        title="Recent Activity"
      >
        <div className="space-y-3">
          {recentActivity.map((attendant) => (
            <div
              key={attendant.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {attendant.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {attendant.role}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {attendant.lastActive}
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AttendantsPage;




