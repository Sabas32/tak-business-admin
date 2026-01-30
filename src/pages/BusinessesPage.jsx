import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Building2, Download, Filter, Plus, Search } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { generatePrintablePDF } from "../utils/printable";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Select from "../components/Select";

const BusinessesPage = () => {
  const { businesses, setBusinesses, users } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [highlightBusinessId, setHighlightBusinessId] = useState(null);
  const userMap = useMemo(
    () =>
      users.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {}),
    [users]
  );

  const filteredBusinesses = businesses.filter((business) => {
    const ownerName =
      business.owner || (business.ownerId ? userMap[business.ownerId] : "");
    const matchesSearch =
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || business.status === statusFilter;
    const matchesPlan = planFilter === "all" || business.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const exportToPDF = () => {
    const tableData = businesses.map((biz) => [
      biz.name,
      biz.owner,
      biz.status,
      biz.plan,
      `UGX ${biz.revenue.toLocaleString()}`,
      biz.employees,
      biz.featured ? "Yes" : "No",
    ]);

    generatePrintablePDF(
      "Business Management Report",
      [
        "Business",
        "Owner",
        "Status",
        "Plan",
        "Revenue",
        "Employees",
        "Featured",
      ],
      tableData
    );
    setToast({ message: "Opening print dialog...", type: "success" });
  };

  const handleEdit = (business) => {
    setEditingBusiness(business);
    setShowModal(true);
  };

  const handleSave = (formData) => {
    const ownerName =
      formData.ownerId ? userMap[formData.ownerId] : formData.owner;
    if (editingBusiness) {
      setBusinesses(
        businesses.map((b) =>
          b.id === editingBusiness.id
            ? { ...b, ...formData, owner: ownerName }
            : b
        )
      );
      setToast({ message: "Business updated successfully!", type: "success" });
    } else {
      setBusinesses([
        ...businesses,
        {
          id: businesses.length + 1,
          ...formData,
          owner: ownerName,
          ownerId: formData.ownerId ?? null,
          created: new Date().toISOString().split("T")[0],
        },
      ]);
      setToast({ message: "Business added successfully!", type: "success" });
    }
    setShowModal(false);
    setEditingBusiness(null);
  };

  const toggleFeatured = (id) => {
    setBusinesses(
      businesses.map((b) => (b.id === id ? { ...b, featured: !b.featured } : b))
    );
    setToast({ message: "Featured status updated!", type: "success" });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlight = params.get("highlight");
    if (!highlight) {
      setHighlightBusinessId(null);
      return;
    }
    const id = Number(highlight);
    if (!Number.isFinite(id)) return;
    setSearchTerm("");
    setStatusFilter("all");
    setPlanFilter("all");
    const exists = businesses.some((business) => business.id === id);
    if (!exists) return;
    setHighlightBusinessId(id);
    const scrollTimer = setTimeout(() => {
      const card = document.querySelector(`[data-business-card="${id}"]`);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 120);
    const clearTimer = setTimeout(() => {
      setHighlightBusinessId(null);
    }, 2200);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, [location.search, businesses]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Business Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage all registered businesses
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button
            onClick={() => {
              setEditingBusiness(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl hover:shadow-lg transition text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Business</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Total Businesses
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {businesses.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {businesses.filter((b) => b.status === "Active").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Featured</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {businesses.filter((b) => b.featured).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Sync Delays
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {businesses.filter((b) => b.syncStatus !== "Healthy").length}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="tak-search flex-1">
            <Search className="w-5 h-5 tak-search-icon" />
            <input
              type="text"
              placeholder="Search businesses..."
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
                { value: "Suspended", label: "Suspended" },
              ]}
              className="w-40"
            />
            <Select
              value={planFilter}
              onChange={setPlanFilter}
              options={[
                { value: "all", label: "All Plans" },
                { value: "Basic", label: "Basic" },
                { value: "Premium", label: "Premium" },
                { value: "Enterprise", label: "Enterprise" },
              ]}
              className="w-44"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredBusinesses.map((business) => (
          <div
            key={business.id}
            data-business-card={business.id}
            className={`bg-white dark:bg-gray-800 tak-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition ${
              highlightBusinessId === business.id ? "tak-row-highlight" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {business.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {business.owner ||
                      (business.ownerId ? userMap[business.ownerId] : "Unassigned")}
                  </p>
                </div>
              </div>
              {business.featured && (
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-lg">
                  Featured
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    business.status === "Active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {business.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Category
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {business.category ?? "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Plan
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {business.plan}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Revenue
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  UGX {business.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Employees
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {business.employees}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Low Stock Alerts
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {business.lowStock}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Setup
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {business.setupStatus ?? "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Sync Status
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg ${
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
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Last Sync
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {business.lastSync}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => navigate(`/businesses/${business.id}`)}
                className="flex-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm font-medium"
              >
                View
              </button>
              <button
                onClick={() => handleEdit(business)}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => toggleFeatured(business.id)}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:shadow-lg transition text-sm font-medium"
              >
                {business.featured ? "Unfeature" : "Feature"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <BusinessFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBusiness(null);
        }}
        onSave={handleSave}
        business={editingBusiness}
        users={users}
      />

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

const BusinessFormModal = ({
  isOpen,
  onClose,
  onSave,
  business,
  users = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    ownerId: "",
    status: "Active",
    plan: "Basic",
    category: "",
    currency: "UGX",
    address: "",
    details: "",
    setupStatus: "Registered",
    revenue: 0,
    employees: 0,
    featured: false,
  });

  useEffect(() => {
    if (business) {
      setFormData(business);
    } else {
      setFormData({
        name: "",
        owner: "",
        ownerId: "",
        status: "Active",
        plan: "Basic",
        category: "",
        currency: "UGX",
        address: "",
        details: "",
        setupStatus: "Registered",
        revenue: 0,
        employees: 0,
        featured: false,
      });
    }
  }, [business]);

  const handleSubmit = () => {
    if (!formData.name) return;
    if (!formData.owner && !formData.ownerId) return;
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={business ? "Edit Business" : "Add New Business"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Owner
            </label>
            <Select
              value={formData.ownerId}
              onChange={(value) =>
                setFormData({ ...formData, ownerId: value })
              }
              options={[
                { value: "", label: "Select owner" },
                ...users.map((user) => ({
                  value: user.id,
                  label: user.name,
                })),
              ]}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={["Active", "Suspended"]}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plan
            </label>
            <Select
              value={formData.plan}
              onChange={(value) => setFormData({ ...formData, plan: value })}
              options={["Basic", "Premium", "Enterprise"]}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <Select
              value={formData.currency}
              onChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
              options={["UGX", "USD", "KES", "RWF", "TZS", "NGN"]}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Details
            </label>
            <textarea
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Revenue
            </label>
            <input
              type="number"
              value={formData.revenue}
              onChange={(e) =>
                setFormData({ ...formData, revenue: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employees
            </label>
            <input
              type="number"
              value={formData.employees}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  employees: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Setup Status
            </label>
            <Select
              value={formData.setupStatus}
              onChange={(value) =>
                setFormData({ ...formData, setupStatus: value })
              }
              options={["Registered", "Verified", "Setup", "Live", "Suspended"]}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Featured Business
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:shadow-lg transition"
          >
            {business ? "Update" : "Add"} Business
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BusinessesPage;




