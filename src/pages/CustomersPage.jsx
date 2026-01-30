import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { MOCK_CUSTOMERS } from "../data/mockData";
import Select from "../components/Select";

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = MOCK_CUSTOMERS.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCustomers = MOCK_CUSTOMERS.length;
  const activeCustomers = MOCK_CUSTOMERS.filter(
    (customer) => customer.status === "Active"
  ).length;
  const totalCredit = MOCK_CUSTOMERS.reduce(
    (sum, customer) => sum + customer.creditBalance,
    0
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Customers
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Monitor customer activity and credit balances
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Customers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalCustomers}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Active Customers
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeCustomers}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Outstanding Credit
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {totalCredit.toLocaleString()}
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
                placeholder="Search customers..."
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
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
                className="w-36"
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
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Total Spent
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Credit Balance
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Last Purchase
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                  {customer.name}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  <div>{customer.email}</div>
                  <div>{customer.phone}</div>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  UGX {customer.totalSpent.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  UGX {customer.creditBalance.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {customer.lastPurchase}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {customer.status}
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

export default CustomersPage;





