import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { CASHFLOW_ENTRIES, EXPENSES } from "../data/mockData";
import Select from "../components/Select";

const CashflowPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredEntries = CASHFLOW_ENTRIES.filter((entry) => {
    const matchesSearch = entry.business
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" || entry.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalIn = CASHFLOW_ENTRIES.filter((entry) => entry.type === "In")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const totalOut = CASHFLOW_ENTRIES.filter((entry) => entry.type === "Out")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const netFlow = totalIn - totalOut;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Cashflow & Expenses
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Review cash in/out, expenses, and net position
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Cash In</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {totalIn.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Cash Out</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {totalOut.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Net Flow</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {netFlow.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="tak-search flex-1">
                  <Search className="w-5 h-5 tak-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by business..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="tak-search-input"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <Select
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={[
                      { value: "all", label: "All Types" },
                      { value: "in", label: "Cash In" },
                      { value: "out", label: "Cash Out" },
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
                    Business
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                      {entry.business}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {entry.type}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {entry.category}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                      UGX {entry.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {entry.date}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {entry.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Recent Expenses
          </h3>
          <div className="space-y-3">
            {EXPENSES.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {expense.category}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {expense.business} . {expense.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    UGX {expense.amount.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      expense.status === "Approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {expense.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashflowPage;





