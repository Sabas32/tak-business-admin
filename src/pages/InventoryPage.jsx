import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import {
  MOCK_PRODUCTS,
  STOCK_ALERTS,
  STOCK_MOVEMENTS,
} from "../data/mockData";
import { useAppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import Select from "../components/Select";

const InventoryPage = () => {
  const { businesses } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const businessRows = useMemo(() => {
    return businesses.map((business) => {
      const products = MOCK_PRODUCTS.filter(
        (product) => product.business === business.name
      );
      const alerts = STOCK_ALERTS.filter(
        (alert) => alert.businessId === business.id
      );
      const movements = STOCK_MOVEMENTS.filter(
        (movement) => movement.business === business.name
      );
      const lowStock = products.filter(
        (product) => product.stock <= product.reorder
      );
      const stockValue = products.reduce(
        (sum, product) => sum + product.stock * product.cost,
        0
      );
      const lastUpdated = products.reduce(
        (latest, product) =>
          product.updated > latest ? product.updated : latest,
        ""
      );
      return {
        id: business.id,
        name: business.name,
        owner: business.owner,
        products,
        alerts,
        movements,
        productCount: products.length,
        lowStockCount: lowStock.length,
        stockValue,
        lastUpdated,
      };
    });
  }, [businesses]);

  const filteredBusinesses = businessRows.filter((row) => {
    const matchesSearch =
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && row.lowStockCount > 0) ||
      (stockFilter === "healthy" &&
        row.productCount > 0 &&
        row.lowStockCount === 0);
    return matchesSearch && matchesStock;
  });

  const totalProducts = MOCK_PRODUCTS.length;
  const lowStockCount = MOCK_PRODUCTS.filter(
    (product) => product.stock <= product.reorder
  ).length;
  const totalStockValue = MOCK_PRODUCTS.reduce(
    (sum, product) => sum + product.stock * product.cost,
    0
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Inventory & Stock
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Track inventory health, stock movements, and low stock alerts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Products</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalProducts}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Low Stock Alerts
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {lowStockCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Stock Cost Value
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {totalStockValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="tak-search flex-1">
                  <Search className="w-5 h-5 tak-search-icon" />
                  <input
                    type="text"
                    placeholder="Search businesses or owners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="tak-search-input"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <Select
                    value={stockFilter}
                    onChange={setStockFilter}
                    options={[
                      { value: "all", label: "All Stock" },
                      { value: "low", label: "Low Stock" },
                      { value: "healthy", label: "Healthy Stock" },
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
                    Business
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Products
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Low Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Stock Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredBusinesses.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
                    onClick={() => setSelectedBusiness(row)}
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {row.owner}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {row.productCount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          row.lowStockCount > 0
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {row.lowStockCount} alerts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      UGX {row.stockValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {row.lastUpdated || "—"}
                    </td>
                  </tr>
                ))}
                {filteredBusinesses.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-6 text-sm text-gray-500 dark:text-gray-400 text-center"
                      colSpan={6}
                    >
                      No businesses match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedBusiness)}
        onClose={() => setSelectedBusiness(null)}
        title={`Inventory · ${selectedBusiness?.name ?? ""}`}
      >
        {selectedBusiness && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-[color:var(--tak-border-strong)] bg-white/80 dark:bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--tak-muted)]">
                  Products
                </p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--tak-text)]">
                  {selectedBusiness.productCount}
                </p>
              </div>
              <div className="rounded-xl border border-[color:var(--tak-border-strong)] bg-white/80 dark:bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--tak-muted)]">
                  Low Stock Alerts
                </p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--tak-text)]">
                  {selectedBusiness.lowStockCount}
                </p>
              </div>
              <div className="rounded-xl border border-[color:var(--tak-border-strong)] bg-white/80 dark:bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--tak-muted)]">
                  Stock Value
                </p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--tak-text)]">
                  UGX {selectedBusiness.stockValue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="tak-table w-full min-w-[520px]">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">SKU</th>
                    <th className="px-6 py-4 text-left">Stock</th>
                    <th className="px-6 py-4 text-left">Reorder</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {selectedBusiness.products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {product.reorder}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        UGX {product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {product.updated}
                      </td>
                    </tr>
                  ))}
                  {selectedBusiness.products.length === 0 && (
                    <tr>
                      <td
                        className="px-6 py-6 text-sm text-gray-500 dark:text-gray-400 text-center"
                        colSpan={6}
                      >
                        No products recorded for this business.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[color:var(--tak-border-strong)] bg-white/80 dark:bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-[color:var(--tak-text)]">
                  Low Stock Alerts
                </h3>
                <div className="mt-3 space-y-2">
                  {selectedBusiness.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-[color:var(--tak-text)]">
                          {alert.item}
                        </p>
                        <p className="text-xs text-[color:var(--tak-muted)]">
                          Reorder at {alert.reorder}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {alert.current} left
                      </span>
                    </div>
                  ))}
                  {selectedBusiness.alerts.length === 0 && (
                    <p className="text-sm text-[color:var(--tak-muted)]">
                      No alerts for this business.
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-[color:var(--tak-border-strong)] bg-white/80 dark:bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-[color:var(--tak-text)]">
                  Recent Movements
                </h3>
                <div className="mt-3 space-y-2">
                  {selectedBusiness.movements.map((movement) => (
                    <div
                      key={movement.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200/70 dark:border-white/10 bg-white/90 dark:bg-gray-900/60 px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-[color:var(--tak-text)]">
                          {movement.item}
                        </p>
                        <p className="text-xs text-[color:var(--tak-muted)]">
                          {movement.type} · {movement.date}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[color:var(--tak-text)]">
                        {movement.qty}
                      </span>
                    </div>
                  ))}
                  {selectedBusiness.movements.length === 0 && (
                    <p className="text-sm text-[color:var(--tak-muted)]">
                      No recent movements for this business.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InventoryPage;





