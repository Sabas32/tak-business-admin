import { useState } from "react";
import { Download, Filter, Search } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { generatePrintablePDF } from "../utils/printable";
import Toast from "../components/Toast";
import Select from "../components/Select";

const TransactionsPage = () => {
  const { transactions } = useAppContext();
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredTransactions = transactions.filter((txn) => {
    if (txn.status === "Refunded") return false;
    const matchesSearch = txn.business
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || txn.status === statusFilter;
    const matchesMethod = methodFilter === "all" || txn.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const exportToPDF = () => {
    const tableData = filteredTransactions.map((txn) => [
      txn.id,
      txn.business,
      `UGX ${txn.amount.toLocaleString()}`,
      txn.date,
      txn.status,
      txn.type,
      txn.method,
    ]);

    generatePrintablePDF(
      "Transactions Report",
      ["ID", "Business", "Amount", "Date", "Status", "Type", "Method"],
      tableData
    );
    setToast({ message: "Opening print dialog...", type: "success" });
  };

  const completedTotal = transactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalFees = transactions
    .filter((t) => t.status !== "Refunded")
    .reduce((sum, t) => sum + (t.fee || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            View and manage all transactions
          </p>
        </div>
        <button
          onClick={exportToPDF}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:shadow-lg transition text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Completed Volume
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {completedTotal.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Fees Collected
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {totalFees.toLocaleString()}
          </p>
        </div>
      </div>

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
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "Completed", label: "Completed" },
                ]}
                className="w-44"
              />
              <Select
                value={methodFilter}
                onChange={setMethodFilter}
                options={[
                  { value: "all", label: "All Methods" },
                  { value: "Card", label: "Card" },
                  { value: "Bank Transfer", label: "Bank Transfer" },
                ]}
                className="w-48"
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
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Business
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Method
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTransactions.map((txn) => (
              <tr
                key={txn.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-mono">
                  #{txn.id}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {txn.business}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  UGX {txn.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {txn.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      txn.status === "Completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {txn.type}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {txn.method}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
};

export default TransactionsPage;





