import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { generatePrintablePDF } from "../utils/printable";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Select from "../components/Select";
import ConfirmDialog from "../components/ConfirmDialog";

const UsersPage = () => {
  const location = useLocation();
  const { users, setUsers, businesses, setBusinesses } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [highlightUserId, setHighlightUserId] = useState(null);
  const itemsPerPage = 5;
  const businessMap = useMemo(
    () =>
      businesses.reduce((acc, business) => {
        acc[business.id] = business.name;
        return acc;
      }, {}),
    [businesses]
  );

  const getBusinessNames = (user) =>
    (user.businessIds ?? []).map((id) => businessMap[id]).filter(Boolean);
  const getBusinessCount = (user) =>
    user.businessIds?.length ?? user.businesses ?? 0;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const indexOfLastItem = currentPageNum * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlight = params.get("highlight");
    if (!highlight) {
      setHighlightUserId(null);
      return;
    }
    const id = Number(highlight);
    if (!Number.isFinite(id)) return;
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) return;
    const nextPage = Math.floor(userIndex / itemsPerPage) + 1;
    setCurrentPageNum(nextPage);
    setHighlightUserId(id);
    const scrollTimer = setTimeout(() => {
      const row = document.querySelector(`[data-user-row="${id}"]`);
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 120);
    const clearTimer = setTimeout(() => {
      setHighlightUserId(null);
    }, 2200);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, [location.search, users]);

  const exportToPDF = () => {
    const tableData = users.map((user) => [
      user.name,
      user.email,
      user.role,
      user.status,
      getBusinessCount(user),
      user.subscriptions,
      `UGX ${user.revenue.toLocaleString()}`,
    ]);

    generatePrintablePDF(
      "User Management Report",
      ["Name", "Email", "Role", "Status", "Businesses", "Plan", "Revenue"],
      tableData
    );
    setToast({ message: "Opening print dialog...", type: "success" });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleView = (user) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const handleViewEdit = (user) => {
    setShowViewModal(false);
    handleEdit(user);
  };

  const handleViewDelete = (user) => {
    setShowViewModal(false);
    handleDelete(user);
  };

  const handleSave = (formData) => {
    const businessCount =
      formData.businessIds?.length ?? formData.businesses ?? 0;
    const fullPhone = formData.phoneNumber
      ? `${formData.phoneCountryCode}${formData.phoneNumber}`
      : "";
    const { password, confirmPassword, ...rest } = formData;
    const nextData = {
      ...rest,
      businesses: businessCount,
      phone: fullPhone,
    };
    if (editingUser) {
      const updatedUser = { ...editingUser, ...nextData };
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      if (updatedUser.role === "Business Owner") {
        setBusinesses((prev) =>
          prev.map((business) =>
            updatedUser.businessIds?.includes(business.id)
              ? {
                  ...business,
                  ownerId: updatedUser.id,
                  owner: updatedUser.name,
                }
              : business
          )
        );
      }
      setToast({ message: "User updated successfully!", type: "success" });
    } else {
      const newUser = {
        id: users.length + 1,
        ...nextData,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setUsers([
        ...users,
        newUser,
      ]);
      if (newUser.role === "Business Owner") {
        setBusinesses((prev) =>
          prev.map((business) =>
            newUser.businessIds?.includes(business.id)
              ? { ...business, ownerId: newUser.id, owner: newUser.name }
              : business
          )
        );
      }
      setToast({ message: "User added successfully!", type: "success" });
    }
    setShowModal(false);
    setEditingUser(null);
  };

  const handleCreateBusiness = (business) => {
    setBusinesses((prev) => [...prev, business]);
  };

  const handleDelete = (user) => {
    setDeleteTarget({ id: user.id, name: user.name });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setUsers(users.filter((u) => u.id !== deleteTarget.id));
    setToast({ message: "User deleted successfully!", type: "success" });
    setDeleteTarget(null);
  };

  const handleStatusToggle = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
    setToast({ message: "User status updated!", type: "success" });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage all users and their permissions
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
              setEditingUser(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl hover:shadow-lg transition text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {users.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Active Users
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {users.filter((u) => u.status === "Active").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Suspended Users
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {users.filter((u) => u.status === "Suspended").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Business Owners
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {users.filter((u) => u.role === "Business Owner").length}
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
                placeholder="Search users..."
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
                value={roleFilter}
                onChange={setRoleFilter}
                options={[
                  { value: "all", label: "All Roles" },
                  { value: "Business Owner", label: "Business Owner" },
                  { value: "Admin", label: "Admin" },
                  { value: "Manager", label: "Manager" },
                ]}
                className="w-48"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="tak-table w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Businesses
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {currentUsers.map((user) => {
                const businessNames = getBusinessNames(user);
                const businessCount = getBusinessCount(user);
                const lastActiveParts = user.lastActive
                  ? user.lastActive.split(" ")
                  : ["-", ""];
                return (
                  <tr
                    key={user.id}
                    data-user-row={user.id}
                    onClick={() => handleView(user)}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer ${
                      highlightUserId === user.id ? "tak-row-highlight" : ""
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CD192F] to-[#D74759] text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.role}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Plan: {user.subscriptions}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleStatusToggle(user.id);
                        }}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            user.status === "Active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-center text-sm font-semibold">
                          {businessCount}
                        </div>
                        {businessNames.length > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {businessNames.slice(0, 2).join(", ")}
                            {businessNames.length > 2
                              ? ` +${businessNames.length - 2}`
                              : ""}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700 dark:text-gray-300">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {lastActiveParts[0]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {lastActiveParts[1]}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium">
              {currentPageNum} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))
              }
              disabled={currentPageNum === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      <UserFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
        user={editingUser}
        businesses={businesses}
        onCreateBusiness={handleCreateBusiness}
      />

      <UserViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingUser(null);
        }}
        user={viewingUser}
        businesses={businesses}
        onEdit={handleViewEdit}
        onDelete={handleViewDelete}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete user?"
        message={`Delete ${deleteTarget?.name ?? "this user"} from the system? This action cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

const UserFormModal = ({
  isOpen,
  onClose,
  onSave,
  user,
  businesses = [],
  onCreateBusiness,
}) => {
  const phoneCountryOptions = [
    { value: "+256", label: "UG (+256)" },
    { value: "+254", label: "KE (+254)" },
    { value: "+250", label: "RW (+250)" },
    { value: "+255", label: "TZ (+255)" },
    { value: "+234", label: "NG (+234)" },
    { value: "+233", label: "GH (+233)" },
    { value: "+1", label: "US (+1)" },
    { value: "+44", label: "UK (+44)" },
  ];
  const currencyOptions = [
    { value: "UGX", label: "UGX" },
    { value: "USD", label: "USD" },
    { value: "KES", label: "KES" },
    { value: "RWF", label: "RWF" },
    { value: "TZS", label: "TZS" },
    { value: "NGN", label: "NGN" },
    { value: "GHS", label: "GHS" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneCountryCode: "+256",
    phoneNumber: "",
    role: "Business Owner",
    status: "Active",
    emailVerified: false,
    phoneVerified: false,
    onboardingStage: "Registered",
    businessIds: [],
    subscriptions: "Basic",
    revenue: 0,
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [businessDraft, setBusinessDraft] = useState({
    name: "",
    category: "",
    currency: "UGX",
    address: "",
    details: "",
    plan: "Basic",
    status: "Active",
  });
  const [businessError, setBusinessError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        businessIds: user.businessIds ?? [],
        phoneCountryCode: user.phoneCountryCode ?? "+256",
        phoneNumber: user.phoneNumber ?? "",
        emailVerified: user.emailVerified ?? false,
        phoneVerified: user.phoneVerified ?? false,
        onboardingStage: user.onboardingStage ?? "Registered",
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phoneCountryCode: "+256",
        phoneNumber: "",
        role: "Business Owner",
        status: "Active",
        emailVerified: false,
        phoneVerified: false,
        onboardingStage: "Registered",
        businessIds: [],
        subscriptions: "Basic",
        revenue: 0,
        password: "",
        confirmPassword: "",
      });
    }
    setFormError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setBusinessDraft({
      name: "",
      category: "",
      currency: "UGX",
      address: "",
      details: "",
      plan: "Basic",
      status: "Active",
    });
    setBusinessError("");
  }, [user, isOpen]);

  const toggleBusiness = (id) => {
    setFormError("");
    setFormData((prev) => {
      const exists = prev.businessIds.includes(id);
      const businessIds = exists
        ? prev.businessIds.filter((value) => value !== id)
        : [...prev.businessIds, id];
      return { ...prev, businessIds };
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      setFormError("Name and email are required.");
      return;
    }
    if (!formData.phoneNumber) {
      setFormError("Phone number is required.");
      return;
    }
    if (!user && !formData.password) {
      setFormError("Password is required for new users.");
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (formData.businessIds.length === 0) {
      setFormError("Select at least one business before saving.");
      return;
    }
    onSave(formData);
  };

  const handleAddBusiness = () => {
    const trimmedName = businessDraft.name.trim();
    if (!trimmedName) {
      setBusinessError("Business name is required.");
      return;
    }
    if (!businessDraft.category) {
      setBusinessError("Business category is required.");
      return;
    }
    if (!businessDraft.currency) {
      setBusinessError("Currency is required.");
      return;
    }
    if (!businessDraft.address.trim()) {
      setBusinessError("Business address is required.");
      return;
    }
    if (!formData.name) {
      setBusinessError("Enter the user name before creating a business.");
      return;
    }
    const nextId =
      businesses.length > 0
        ? Math.max(...businesses.map((business) => business.id)) + 1
        : 1;
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);
    const newBusiness = {
      id: nextId,
      name: trimmedName,
      owner: formData.name,
      status: businessDraft.status,
      plan: businessDraft.plan,
      category: businessDraft.category,
      currency: businessDraft.currency,
      address: businessDraft.address,
      details: businessDraft.details,
      revenue: 0,
      employees: 1,
      created: date,
      featured: false,
      lowStock: 0,
      syncStatus: "Healthy",
      lastSync: `${date} ${time}`,
    };

    onCreateBusiness?.(newBusiness);
    setFormData((prev) => ({
      ...prev,
      businessIds: prev.businessIds.includes(nextId)
        ? prev.businessIds
        : [...prev.businessIds, nextId],
    }));
    setBusinessDraft({
      name: "",
      category: "",
      currency: "UGX",
      address: "",
      details: "",
      plan: "Basic",
      status: "Active",
    });
    setBusinessError("");
    setFormError("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Add New User"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormError("");
                setFormData({ ...formData, name: e.target.value });
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormError("");
                setFormData({ ...formData, email: e.target.value });
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Country
            </label>
            <Select
              value={formData.phoneCountryCode}
              onChange={(value) => {
                setFormError("");
                setFormData({ ...formData, phoneCountryCode: value });
              }}
              options={phoneCountryOptions}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormError("");
                setFormData({ ...formData, phoneNumber: e.target.value });
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              placeholder="700 000 000"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormError("");
                  setFormData({ ...formData, password: e.target.value });
                }}
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                placeholder={user ? "Leave blank to keep" : "Minimum 6 characters"}
                required={!user}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormError("");
                  setFormData({ ...formData, confirmPassword: e.target.value });
                }}
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                placeholder={user ? "Leave blank to keep" : "Repeat password"}
                required={!user}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <Select
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
              options={["Business Owner", "Admin", "Manager"]}
              className="w-full"
            />
          </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Onboarding Stage
            </label>
            <Select
              value={formData.onboardingStage}
              onChange={(value) =>
                setFormData({ ...formData, onboardingStage: value })
              }
              options={["Registered", "Verified", "Setup", "Live"]}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-3 pt-7">
            <input
              type="checkbox"
              checked={formData.emailVerified}
              onChange={(e) =>
                setFormData({ ...formData, emailVerified: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Email Verified
            </span>
          </div>
          <div className="flex items-center gap-3 pt-7">
            <input
              type="checkbox"
              checked={formData.phoneVerified}
              onChange={(e) =>
                setFormData({ ...formData, phoneVerified: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Phone Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subscription
            </label>
            <Select
              value={formData.subscriptions}
              onChange={(value) =>
                setFormData({ ...formData, subscriptions: value })
              }
              options={["Basic", "Premium", "Enterprise"]}
              className="w-full"
            />
          </div>
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
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Create Business
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Add a new business and assign it to this user.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/70 dark:bg-white/10 text-gray-600 dark:text-gray-300">
              Auto-assign
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={businessDraft.name}
                onChange={(e) => {
                  setBusinessError("");
                  setBusinessDraft({
                    ...businessDraft,
                    name: e.target.value,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Sunrise Mart"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Business Category
              </label>
              <input
                type="text"
                value={businessDraft.category}
                onChange={(e) => {
                  setBusinessError("");
                  setBusinessDraft({
                    ...businessDraft,
                    category: e.target.value,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Retail"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Currency
              </label>
              <Select
                value={businessDraft.currency}
                onChange={(value) => {
                  setBusinessError("");
                  setBusinessDraft({ ...businessDraft, currency: value });
                }}
                options={currencyOptions}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Business Address
              </label>
              <input
                type="text"
                value={businessDraft.address}
                onChange={(e) => {
                  setBusinessError("");
                  setBusinessDraft({
                    ...businessDraft,
                    address: e.target.value,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Kampala - Nakasero"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Business Details
              </label>
              <textarea
                value={businessDraft.details}
                onChange={(e) => {
                  setBusinessError("");
                  setBusinessDraft({
                    ...businessDraft,
                    details: e.target.value,
                  });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                placeholder="Add extra details (optional)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Plan
              </label>
              <Select
                value={businessDraft.plan}
                onChange={(value) => {
                  setBusinessError("");
                  setBusinessDraft({ ...businessDraft, plan: value });
                }}
                options={["Basic", "Premium", "Enterprise"]}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Status
              </label>
              <Select
                value={businessDraft.status}
                onChange={(value) => {
                  setBusinessError("");
                  setBusinessDraft({ ...businessDraft, status: value });
                }}
                options={["Active", "Suspended"]}
                className="w-full"
              />
            </div>
          </div>
          {businessError && (
            <p className="text-xs text-red-500">{businessError}</p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddBusiness}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
            >
              Add Business
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assign Businesses
          </label>
          <div className="space-y-2 max-h-44 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-3">
            {businesses.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No businesses available. Add a business first.
              </p>
            )}
            {businesses.map((business) => (
              <label
                key={business.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 border border-gray-100 dark:border-gray-700"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {business.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Owner: {business.owner}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.businessIds.includes(business.id)}
                  onChange={() => toggleBusiness(business.id)}
                  className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                />
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Each user must have at least one business.
          </p>
          {formError && (
            <p className="text-xs text-red-500 mt-2">{formError}</p>
          )}
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
            {user ? "Update" : "Add"} User
          </button>
        </div>
      </div>
    </Modal>
  );
};

const UserViewModal = ({
  isOpen,
  onClose,
  user,
  businesses = [],
  onEdit,
  onDelete,
}) => {
  if (!user) return null;

  const businessNames = (user.businessIds ?? [])
    .map((id) => businesses.find((business) => business.id === id)?.name)
    .filter(Boolean);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details">
      <div className="space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {user.name[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Role
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.role}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Status
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.status}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Email Verified
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.emailVerified ? "Verified" : "Pending"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Phone Verified
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.phoneVerified ? "Verified" : "Pending"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Phone
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.phoneNumber
                ? `${user.phoneCountryCode ?? ""} ${user.phoneNumber}`
                : user.phone ?? "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Onboarding Stage
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.onboardingStage ?? "Invited"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Businesses
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {businessNames.length}
            </p>
            {businessNames.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {businessNames.join(", ")}
              </p>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Subscription
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.subscriptions}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Join Date
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.joinDate}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Last Active
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.lastActive}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Revenue
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              UGX {user.revenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Activity Summary
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This user has been active for{" "}
            {Math.floor(
              (new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24)
            )}{" "}
            days and manages {businessNames.length} business
            {businessNames.length !== 1 ? "es" : ""}.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(user)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Edit User
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(user)}
            className="px-4 py-2 border border-red-500/40 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            Delete User
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UsersPage;





