import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, ChevronLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import {
  BUSINESS_DETAILS,
  MOCK_ATTENDANTS,
  STOCK_ALERTS,
} from "../data/mockData";

const BusinessDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { businesses, transactions } = useAppContext();
  const [activeTab, setActiveTab] = useState("overview");

  const businessId = Number(id);
  const business = businesses.find((b) => b.id === businessId);
  const details = BUSINESS_DETAILS.find((d) => d.businessId === businessId);

  const businessTransactions = useMemo(() => {
    if (!business) return [];
    return transactions.filter((t) => t.business === business.name);
  }, [business, transactions]);

  if (!business) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/businesses")}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Back to businesses
        </button>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300">
            Business not found.
          </p>
        </div>
      </div>
    );
  }

  const totalSales = businessTransactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalRefunds = businessTransactions
    .filter((t) => t.status === "Refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  const attendants = MOCK_ATTENDANTS.filter(
    (attendant) => attendant.businessId === businessId
  );
  const stockAlerts = STOCK_ALERTS.filter(
    (alert) => alert.businessId === businessId
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sales", label: "Sales" },
    { id: "stock", label: "Stock" },
    { id: "attendants", label: "Attendants" },
    { id: "billing", label: "Billing" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/businesses")}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {business.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Owner: {business.owner} . Plan: {business.plan}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {business.status}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              business.syncStatus === "Healthy"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : business.syncStatus === "Delayed"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {business.syncStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {business.revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Employees</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {business.employees}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Low Stock Alerts
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {business.lowStock}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Last Sync</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {business.lastSync}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                activeTab === tab.id
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Business Overview
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      VAT {details?.vatRate ?? "N/A"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Created: {business.created}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Category: {business.category ?? "Unassigned"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Currency: {business.currency ?? details?.currency ?? "UGX"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Address: {business.address ?? "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Subscription Health
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Last Payment: {details?.lastPayment}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Next Renewal: {details?.nextRenewal}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Status: {details?.paymentStatus}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Setup: {business.setupStatus ?? "Pending"}
                </p>
                {business.details && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {business.details}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "sales" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Completed Sales
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    UGX {totalSales.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Refunds
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    UGX {totalRefunds.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Transactions
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {businessTransactions.length}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="tak-table w-full min-w-[560px]">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                        Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {businessTransactions.map((txn) => (
                      <tr key={txn.id}>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {txn.date}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-semibold">
                          UGX {txn.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              txn.status === "Completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {txn.method}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "stock" && (
            <div className="space-y-4">
              {stockAlerts.length === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No low stock alerts for this business.
                </p>
              )}
              {stockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {alert.item}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Reorder at {alert.reorder}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {alert.current} left
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "attendants" && (
            <div className="space-y-3">
              {attendants.length === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No attendants assigned to this business.
                </p>
              )}
              {attendants.map((attendant) => (
                <div
                  key={attendant.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {attendant.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {attendant.role}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "billing" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Plan Details
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Plan: {business.plan}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Payment Status: {details?.paymentStatus}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Billing Cycle
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Last Payment: {details?.lastPayment}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Next Renewal: {details?.nextRenewal}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsPage;


