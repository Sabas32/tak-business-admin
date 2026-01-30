import { useEffect, useState } from "react";
import { Check, Edit, Eye, EyeOff, Plus, Users } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Select from "../components/Select";
import ConfirmDialog from "../components/ConfirmDialog";

const RolesPage = () => {
  const { admins, setAdmins, currentUser } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [permissionsTarget, setPermissionsTarget] = useState(null);
  const permissionLabels = {
    all: "All Access",
    dashboard: "Dashboard",
    users: "User Management",
    attendants: "Attendants",
    customers: "Customers",
    support: "Support",
    "onboarding-auth": "Onboarding & Auth",
    businesses: "Businesses",
    transactions: "Transactions",
    inventory: "Inventory",
    cashflow: "Cashflow",
    expenses: "Expenses",
    refunds: "Refunds",
    reports: "Reports",
    analytics: "Analytics",
    notifications: "Notifications",
    emails: "Emails",
    billing: "Billing & Subscriptions",
    "feature-limits": "Feature Limits",
    "system-health": "System Health",
    "audit-log": "Audit Log",
    roles: "Admin Roles",
    settings: "Settings",
  };

  const handleSaveRole = (formData) => {
    if (editingAdmin) {
      setAdmins(
        admins.map((admin) =>
          admin.id === editingAdmin.id
            ? {
                ...admin,
                ...formData,
                password: formData.password || admin.password,
              }
            : admin
        )
      );
      setToast({ message: "Admin role updated successfully!", type: "success" });
    } else {
      setAdmins([...admins, { id: admins.length + 1, ...formData }]);
      setToast({ message: "Admin role added successfully!", type: "success" });
    }
    setShowModal(false);
    setEditingAdmin(null);
  };

  const handleDelete = (admin) => {
    setDeleteTarget({ id: admin.id, name: admin.username });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setAdmins(admins.filter((a) => a.id !== deleteTarget.id));
    setToast({ message: "Admin role deleted!", type: "success" });
    setDeleteTarget(null);
  };

  if (currentUser?.role !== "Super Admin") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only Super Admins can manage admin roles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Roles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage admin users and their permissions
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAdmin(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:shadow-lg transition text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Total Admins
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {admins.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Super Admins
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {admins.filter((a) => a.role === "Super Admin").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Limited Roles
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {admins.filter((a) => !a.permissions.includes("all")).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {admins.map((admin) => {
          const visiblePermissions = admin.permissions;
          return (
            <div
              key={admin.id}
              className="relative overflow-hidden bg-white/95 dark:bg-[#141414] tak-card rounded-2xl p-6 shadow-[0_24px_60px_-48px_rgba(0,0,0,0.7)] border border-gray-200/80 dark:border-white/10 flex flex-col w-full"
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-red-500 via-red-400 to-transparent opacity-80" />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-2xl font-bold shadow-[0_18px_30px_-22px_rgba(0,0,0,0.6)]">
                    {admin.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                      Admin Profile
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                      {admin.username}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {admin.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-3">
                  <span className="px-3 py-1 rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.2em] border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
                    {admin.role}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <div className="rounded-xl bg-gray-50 dark:bg-white/5 px-3 py-2 border border-gray-200/70 dark:border-white/10 text-sm">
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                        Access
                      </p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {admin.permissions.includes("all")
                          ? "Full Access"
                          : "Scoped Access"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 dark:bg-white/5 px-3 py-2 border border-gray-200/70 dark:border-white/10 text-sm">
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                        Modules
                      </p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {admin.permissions.includes("all")
                          ? "All modules"
                          : `${admin.permissions.length} modules`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex-1 border-t border-gray-100 dark:border-white/10 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-gray-200/80 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-[0.2em]">
                      Permissions
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {admin.permissions.includes("all")
                        ? "All permissions"
                        : `${admin.permissions.length} enabled`}
                    </p>
                  </div>
                  <button
                    onClick={() => setPermissionsTarget(admin)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </div>
              </div>

              <div className="tak-actions mt-5 border-t border-gray-100 dark:border-white/10 pt-4">
                <button
                  onClick={() => {
                    setEditingAdmin(admin);
                    setShowModal(true);
                  }}
                  className="flex-1 min-h-[44px] px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              {admin.role !== "Super Admin" && (
                <button
                  onClick={() => handleDelete(admin)}
                  className="flex-1 min-h-[44px] px-4 py-3 rounded-xl border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition text-sm font-semibold"
                >
                  Remove
                </button>
              )}
              </div>
            </div>
          );
        })}
      </div>

      <AddRoleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveRole}
        admin={editingAdmin}
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
        title="Remove admin role?"
        message={`Remove ${deleteTarget?.name ?? "this admin"} from admin access? This action cannot be undone.`}
        confirmLabel="Remove"
        tone="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />

      <Modal
        isOpen={Boolean(permissionsTarget)}
        onClose={() => setPermissionsTarget(null)}
        title={`Permissions · ${permissionsTarget?.username ?? ""}`}
      >
        {permissionsTarget?.permissions.includes("all") ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
            All permissions granted across the platform.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(permissionsTarget?.permissions ?? []).map((perm, idx) => (
              <div
                key={`${perm}-${idx}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/60 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {permissionLabels[perm] ?? perm}
                  </span>
                </div>
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Enabled
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

const AddRoleModal = ({ isOpen, onClose, onSave, admin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    roleName: "",
    roleTemplate: "Support Admin",
    permissions: [],
  });
  const isEditing = Boolean(admin);
  const [showPassword, setShowPassword] = useState(false);

  const availablePermissions = [
    { value: "all", label: "All Access" },
    { value: "dashboard", label: "Dashboard" },
    { value: "users", label: "User Management" },
    { value: "attendants", label: "Attendants" },
    { value: "customers", label: "Customers" },
    { value: "support", label: "Support" },
    { value: "onboarding-auth", label: "Onboarding & Auth" },
    { value: "businesses", label: "Businesses" },
    { value: "transactions", label: "Transactions" },
    { value: "inventory", label: "Inventory" },
    { value: "cashflow", label: "Cashflow" },
    { value: "expenses", label: "Expenses" },
    { value: "refunds", label: "Refunds" },
    { value: "reports", label: "Reports" },
    { value: "analytics", label: "Analytics" },
    { value: "notifications", label: "Notifications" },
    { value: "emails", label: "Emails" },
    { value: "billing", label: "Billing & Subscriptions" },
    { value: "feature-limits", label: "Feature Limits" },
    { value: "system-health", label: "System Health" },
    { value: "audit-log", label: "Audit Log" },
    { value: "roles", label: "Admin Roles" },
    { value: "settings", label: "Settings" },
  ];

  useEffect(() => {
    if (!isOpen) return;
    if (admin) {
      setFormData({
        username: admin.username ?? "",
        email: admin.email ?? "",
        password: "",
        roleName: admin.role ?? "",
        roleTemplate: admin.role ?? "Support Admin",
        permissions: admin.permissions ?? [],
      });
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        roleName: "",
        roleTemplate: "Support Admin",
        permissions: [],
      });
    }
    setShowPassword(false);
  }, [admin, isOpen]);

  const handlePermissionToggle = (perm) => {
    if (perm === "all") {
      setFormData({
        ...formData,
        permissions: formData.permissions.includes("all") ? [] : ["all"],
      });
      return;
    }
    const basePermissions = formData.permissions.includes("all")
      ? []
      : [...formData.permissions];
    if (basePermissions.includes(perm)) {
      setFormData({
        ...formData,
        permissions: basePermissions.filter((p) => p !== perm),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...basePermissions, perm],
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.username || !formData.email) return;
    if (!isEditing && !formData.password) return;
    const roleName = formData.roleName.trim() || formData.roleTemplate;
    const permissions =
      roleName === "Super Admin"
        ? ["all"]
        : formData.permissions.includes("all")
        ? ["all"]
        : formData.permissions;
    onSave({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: roleName,
      permissions,
    });
    setFormData({
      username: "",
      email: "",
      password: "",
      roleName: "",
      roleTemplate: "Support Admin",
      permissions: [],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Admin Role" : "Add Admin Role"}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              placeholder={
                isEditing ? "Leave blank to keep" : "Minimum 6 characters"
              }
              required={!isEditing}
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
            Role Name
          </label>
          <input
            type="text"
            value={formData.roleName}
            onChange={(e) =>
              setFormData({ ...formData, roleName: e.target.value })
            }
            placeholder={formData.roleTemplate}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role Template (optional)
          </label>
          <Select
            value={formData.roleTemplate}
            onChange={(value) =>
              setFormData({ ...formData, roleTemplate: value })
            }
            options={["Support Admin", "Finance Admin", "Super Admin"]}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Permissions
          </label>
          <div className="grid grid-cols-2 gap-3">
            {availablePermissions.map((perm) => (
              <div key={perm.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={perm.value}
                  checked={formData.permissions.includes(perm.value)}
                  onChange={() => handlePermissionToggle(perm.value)}
                  disabled={
                    perm.value !== "all" &&
                    formData.permissions.includes("all")
                  }
                  className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor={perm.value}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {perm.label}
                </label>
              </div>
            ))}
          </div>
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
            {isEditing ? "Save Changes" : "Add Role"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RolesPage;

