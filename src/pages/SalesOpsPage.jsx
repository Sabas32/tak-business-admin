import { useState } from "react";
import { Download, Filter, Search } from "lucide-react";
import { MOCK_SALES } from "../data/mockData";
import { generatePrintablePDF } from "../utils/printable";
import Toast from "../components/Toast";
import Select from "../components/Select";

const SalesOpsPage = () => {
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredSales = MOCK_SALES.filter((sale) => {
    const matchesSearch =
      sale.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.cashier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || sale.status === statusFilter;
    const matchesType = typeFilter === "all" || sale.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCompleted = MOCK_SALES.filter(
    (sale) => sale.status === "Completed"
  ).reduce((sum, sale) => sum + sale.total, 0);
  const onHoldCount = MOCK_SALES.filter(
    (sale) => sale.status === "On-hold"
  ).length;
  const returnedCount = MOCK_SALES.filter(
    (sale) => sale.status === "Returned"
  ).length;
  const avgOrder =
    MOCK_SALES.length === 0
      ? 0
      : Math.round(
          MOCK_SALES.reduce((sum, sale) => sum + sale.total, 0) /
            MOCK_SALES.length
        );

  const exportToPDF = () => {
    const tableData = filteredSales.map((sale) => [
      sale.id,
      sale.business,
      sale.cashier,
      sale.items,
      `UGX ${sale.total.toLocaleString()}`,
      sale.status,
      sale.payment,
      sale.date,
    ]);

    generatePrintablePDF(
      "Sales Operations Report",
      ["ID", "Business", "Cashier", "Items", "Total", "Status", "Payment", "Date"],
      tableData
    );
    setToast({ message: "Opening print dialog...", type: "success" });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sales Operations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Monitor sales, returns, and on-hold transactions
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

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Completed Sales
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {totalCompleted.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            On-hold Sales
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {onHoldCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Returns
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {returnedCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Avg Order Value
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {avgOrder.toLocaleString()}
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
                placeholder="Search by business or cashier..."
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
                  { value: "On-hold", label: "On-hold" },
                  { value: "Returned", label: "Returned" },
                ]}
                className="w-44"
              />
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "Retail", label: "Retail" },
                  { value: "Wholesale", label: "Wholesale" },
                ]}
                className="w-40"
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
                  Cashier
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                    #{sale.id}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {sale.business}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {sale.cashier}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {sale.items}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                    UGX {sale.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sale.status === "Completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : sale.status === "On-hold"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {sale.payment}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {sale.date}
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

export default SalesOpsPage;





