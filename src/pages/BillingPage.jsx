import { useState } from "react";
import { CheckCircle2, Download, Edit, Filter, Plus, Search, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { SUBSCRIPTIONS } from "../data/mockData";
import { generatePrintablePDF } from "../utils/printable";
import Modal from "../components/Modal";
import Select from "../components/Select";
import Toast from "../components/Toast";

const BillingPage = () => {
  const { businesses } = useAppContext();
  const [toast, setToast] = useState(null);
  const [plans, setPlans] = useState([
    {
      name: "Basic",
      price: 10000,
      features: ["Up to 5 products", "Basic analytics", "Email support"],
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Premium",
      featured: true,
      price: 25000,
      features: [
        "Unlimited products",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
      ],
      color: "from-amber-500 to-orange-600",
    },
    {
      name: "Enterprise",
      price: 50000,
      features: [
        "Everything in Premium",
        "Dedicated account manager",
        "API access",
        "Custom integrations",
      ],
      color: "from-red-500 to-amber-600",
    },
  ]);
  const [subscriptions, setSubscriptions] = useState(SUBSCRIPTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({ price: "", features: [] });
  const [featureDraft, setFeatureDraft] = useState("");

  const planCounts = plans.reduce((acc, plan) => {
    acc[plan.name] = businesses.filter((b) => b.plan === plan.name).length;
    return acc;
  }, {});

  const totalMRR = businesses.reduce((sum, biz) => {
    const plan = plans.find((p) => p.name === biz.plan);
    return sum + (plan?.price || 0);
  }, 0);

  const upcomingRenewals = businesses
    .filter((b) => b.status === "Active")
    .slice(0, 3);

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch = subscription.business
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || subscription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscriptions.filter(
    (subscription) => subscription.status === "Active"
  ).length;
  const overdueCount = subscriptions.filter(
    (subscription) => subscription.status === "Overdue"
  ).length;
  const monthlyValue = subscriptions.reduce(
    (sum, subscription) => sum + subscription.amount,
    0
  );

  const exportToPDF = () => {
    const tableData = subscriptions.map((sub) => [
      sub.business,
      sub.plan,
      sub.status,
      sub.paymentStatus,
      sub.renewal,
      `UGX ${sub.amount.toLocaleString()}`,
    ]);

    generatePrintablePDF(
      "Billing & Subscriptions Report",
      ["Business", "Plan", "Status", "Payment", "Renewal", "Monthly Fee"],
      tableData
    );
    setToast({ message: "Opening print dialog...", type: "success" });
  };

  const openPlanEditor = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      price: plan.price.toString(),
      features: plan.features ?? [],
    });
    setFeatureDraft("");
  };

  const closePlanEditor = () => {
    setEditingPlan(null);
    setPlanForm({ price: "", features: [] });
    setFeatureDraft("");
  };

  const normalizeFeatures = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const addFeature = () => {
    const nextItems = featureDraft
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    if (nextItems.length === 0) return;
    setPlanForm((prev) => ({
      ...prev,
      features: [...normalizeFeatures(prev.features), ...nextItems],
    }));
    setFeatureDraft("");
  };

  const removeFeature = (index) => {
    setPlanForm((prev) => {
      const next = [...normalizeFeatures(prev.features)];
      next.splice(index, 1);
      return { ...prev, features: next };
    });
  };

  const handlePlanSave = () => {
    if (!editingPlan) return;
    const parsedPrice = Number(planForm.price);
    const nextPrice = Number.isFinite(parsedPrice)
      ? parsedPrice
      : editingPlan.price;
    const nextFeatures = normalizeFeatures(planForm.features);

    setPlans((prev) =>
      prev.map((plan) =>
        plan.name === editingPlan.name
          ? {
              ...plan,
              price: nextPrice,
              features: nextFeatures.length > 0 ? nextFeatures : plan.features,
            }
          : plan
      )
    );

    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.plan === editingPlan.name ? { ...sub, amount: nextPrice } : sub
      )
    );

    setToast({
      message: `${editingPlan.name} plan updated successfully.`,
      type: "success",
    });
    closePlanEditor();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Billing & Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage subscription plans, pricing, and billing activity
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
            Monthly Recurring Revenue
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {totalMRR.toLocaleString()}
          </p>
        </div>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {plan.name} Subscribers
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {planCounts[plan.name] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
          Upcoming Renewals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {upcomingRenewals.map((biz) => (
            <div
              key={biz.id}
              className="p-4 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {biz.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Plan: {biz.plan}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Renewal in 7 days
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((plan) => {
          const isFeatured = Boolean(plan.featured);
          return (
            <div
              key={plan.name}
              className={`tak-card tak-plan-card rounded-2xl p-5 sm:p-6 flex h-full flex-col ${
                isFeatured ? "tak-plan-card--featured" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-br ${plan.color}`}
                  />
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--tak-muted)] font-semibold">
                      Plan
                    </p>
                    <h3 className="text-xl font-semibold text-[color:var(--tak-text)]">
                      {plan.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        isFeatured
                          ? "text-[color:var(--tak-accent)]"
                          : "text-[color:var(--tak-text-gray)]"
                      }`}
                    >
                      UGX {plan.price.toLocaleString()} / month
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openPlanEditor(plan)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--tak-border-strong)] text-[color:var(--tak-muted)] transition hover:border-[color:var(--tak-accent)] hover:text-[color:var(--tak-accent)]"
                  aria-label={`Edit ${plan.name} plan`}
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 flex-1 space-y-2">
                {plan.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm text-[color:var(--tak-text-gray)]"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--tak-success)]" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-[color:var(--tak-border)] flex items-center justify-between text-xs text-[color:var(--tak-muted)]">
                <span>Active subscriptions</span>
                <span className="text-sm font-semibold text-[color:var(--tak-text)]">
                  {businesses.filter((b) => b.plan === plan.name).length}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Overdue</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {overdueCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Monthly Value
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {monthlyValue.toLocaleString()}
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
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
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
                  { value: "Overdue", label: "Overdue" },
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
                Business
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Plan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Renewal
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredSubscriptions.map((subscription) => (
              <tr
                key={subscription.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                  {subscription.business}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {subscription.plan}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      subscription.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {subscription.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {subscription.paymentStatus}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {subscription.renewal}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  UGX {subscription.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={Boolean(editingPlan)}
        onClose={closePlanEditor}
        title={`Edit ${editingPlan?.name ?? ""} Plan`}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              value={editingPlan?.name ?? ""}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            />
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Price (UGX)
            </label>
            <input
              type="number"
              min="0"
              value={planForm.price}
              onChange={(event) =>
                setPlanForm({ ...planForm, price: event.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feature List
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="text"
                placeholder="Add a feature and press Enter"
                value={featureDraft}
                onChange={(event) => setFeatureDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addFeature();
                  }
                }}
                className="flex-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[color:var(--tak-border-strong)] text-sm font-semibold text-[color:var(--tak-text-gray)] hover:border-[color:var(--tak-accent)] hover:text-[color:var(--tak-accent)] transition"
              >
                <Plus className="w-4 h-4" />
                Add feature
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {normalizeFeatures(planForm.features).length === 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  No features added yet.
                </span>
              )}
              {normalizeFeatures(planForm.features).map((feature, idx) => (
                <div
                  key={`${feature}-${idx}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200/70 dark:border-white/10 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50/80 dark:bg-white/5"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--tak-success)]" />
                    <span>{feature}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="rounded-full p-1 hover:bg-gray-200/70 dark:hover:bg-white/10 transition"
                    aria-label={`Remove ${feature}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Tip: paste multiple features on separate lines, then press Add.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={closePlanEditor}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePlanSave}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:shadow-lg transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

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

export default BillingPage;
