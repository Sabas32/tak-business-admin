import { useEffect, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import {
  CASHFLOW_ENTRIES,
  MOCK_REPORTS,
  MOCK_SALES,
  PROFIT_SUMMARY,
  STOCK_MOVEMENTS,
} from "../data/mockData";
import Toast from "../components/Toast";
import { downloadReportPDF, generatePrintablePDF } from "../utils/printable";

const ReportsPage = () => {
  const [toast, setToast] = useState(null);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (event) => {
      const menu = event.target.closest(`[data-report-menu="${openMenuId}"]`);
      if (!menu) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const updateLastGenerated = (reportId) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, lastGenerated: new Date().toLocaleString() }
          : report
      )
    );
  };

  const buildReportPayload = (report) => {
    switch (report.name) {
      case "Sales Summary":
        return {
          title: report.name,
          headers: [
            "Business",
            "Cashier",
            "Items",
            "Total",
            "Status",
            "Payment",
            "Date",
          ],
          rows: MOCK_SALES.map((sale) => [
            sale.business,
            sale.cashier,
            sale.items,
            `UGX ${sale.total.toLocaleString()}`,
            sale.status,
            sale.payment,
            sale.date,
          ]),
        };
      case "Inventory Movement":
        return {
          title: report.name,
          headers: ["Business", "Type", "Item", "Qty", "Date"],
          rows: STOCK_MOVEMENTS.map((movement) => [
            movement.business,
            movement.type,
            movement.item,
            movement.qty,
            movement.date,
          ]),
        };
      case "Cashflow Statement":
        return {
          title: report.name,
          headers: ["Business", "Type", "Category", "Amount", "Date", "Note"],
          rows: CASHFLOW_ENTRIES.map((entry) => [
            entry.business,
            entry.type,
            entry.category,
            `UGX ${entry.amount.toLocaleString()}`,
            entry.date,
            entry.note,
          ]),
        };
      case "Profit Summary":
        return {
          title: report.name,
          headers: ["Month", "Revenue", "Expenses", "COGS", "Net Profit"],
          rows: PROFIT_SUMMARY.map((entry) => [
            entry.month,
            `UGX ${entry.revenue.toLocaleString()}`,
            `UGX ${entry.expenses.toLocaleString()}`,
            `UGX ${entry.cogs.toLocaleString()}`,
            `UGX ${entry.netProfit.toLocaleString()}`,
          ]),
        };
      default:
        return {
          title: report.name,
          headers: ["Report", "Last Generated"],
          rows: [[report.name, report.lastGenerated]],
        };
    }
  };

  const openReport = (report, mode) => {
    const payload = buildReportPayload(report);
    if (mode === "export") {
      downloadReportPDF(payload.title, payload.headers, payload.rows);
    } else {
      generatePrintablePDF(payload.title, payload.headers, payload.rows);
    }
    updateLastGenerated(report.id);
    setToast({
      message:
        mode === "export"
          ? `Exporting ${report.name}...`
          : `Generating ${report.name}...`,
      type: mode === "export" ? "success" : "info",
    });
  };

  const toggleMenu = (reportId) => {
    setOpenMenuId((prev) => (prev === reportId ? null : reportId));
  };

  const closeMenu = () => setOpenMenuId(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Generate operational and financial reports across all businesses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {report.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {report.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Last generated: {report.lastGenerated}
            </p>
            <div
              className="relative mt-4"
              data-report-menu={report.id}
            >
              <button
                type="button"
                onClick={() => toggleMenu(report.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:shadow-lg transition text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Report Actions</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {openMenuId === report.id && (
                <div className="absolute right-0 mt-2 w-full bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-2 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      openReport(report, "generate");
                      closeMenu();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Generate Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openReport(report, "export");
                      closeMenu();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
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

export default ReportsPage;

