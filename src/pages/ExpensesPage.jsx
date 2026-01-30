import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { EXPENSES } from "../data/mockData";
import Select from "../components/Select";

const ExpensesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [businessFilter, setBusinessFilter] = useState("all");

  const businessOptions = useMemo(() => {
    const businesses = [...new Set(EXPENSES.map((item) => item.business))];
    return [
      { value: "all", label: "All Businesses" },
      ...businesses.map((business) => ({
        value: business,
        label: business,
      })),
    ];
  }, []);

  const filteredExpenses = EXPENSES.filter((expense) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      expense.business.toLowerCase().includes(searchValue) ||
      expense.category.toLowerCase().includes(searchValue) ||
      expense.note.toLowerCase().includes(searchValue);
    const matchesStatus =
      statusFilter === "all" || expense.status === statusFilter;
    const matchesBusiness =
      businessFilter === "all" || expense.business === businessFilter;
    return matchesSearch && matchesStatus && matchesBusiness;
  });

  const totalAmount = EXPENSES.reduce((sum, item) => sum + item.amount, 0);
  const approvedAmount = EXPENSES.filter((item) => item.status === "Approved")
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = EXPENSES.filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);
  const avgExpense =
    EXPENSES.length === 0 ? 0 : Math.round(totalAmount / EXPENSES.length);

  const categorySummary = useMemo(() => {
    return EXPENSES.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});
  }, []);

  const topCategories = useMemo(
    () =>
      Object.entries(categorySummary)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4),
    [categorySummary]
  );

  const recentApprovals = useMemo(
    () =>
      EXPENSES.filter((item) => item.status === "Approved")
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3),
    []
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Expenses
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Track expense approvals, categories, and business spend
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Total Spend
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Approved</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {approvedAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {pendingAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Avg Expense</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {avgExpense.toLocaleString()}
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
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="tak-search-input"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "Approved", label: "Approved" },
                      { value: "Pending", label: "Pending" },
                    ]}
                    className="w-36"
                  />
                  <Select
                    value={businessFilter}
                    onChange={setBusinessFilter}
                    options={businessOptions}
                    className="w-44"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="tak-table w-full min-w-[720px]">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Business
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Status
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
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                      {expense.business}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                      UGX {expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          expense.status === "Approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {expense.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Top Categories
            </h3>
            <div className="space-y-3">
              {topCategories.map(([category, amount]) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {category}
                  </p>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    UGX {amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Recent Approvals
            </h3>
            <div className="space-y-3">
              {recentApprovals.map((expense) => (
                <div
                  key={expense.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {expense.business}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {expense.category} . {expense.date}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                    UGX {expense.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;





